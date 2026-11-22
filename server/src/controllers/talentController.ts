import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import { calculateBudgetSplit, calculateMilestonesSchedule } from '../services/mathEngine.js';

export const updateAvailabilitySchema = z.object({
  availabilityStatus: z.enum(['AVAILABLE_NOW', 'LIMITED', 'UNAVAILABLE']),
});

export const acceptInviteSchema = z.object({
  signedName: z.string().min(2, 'Full legal name required to e-sign'),
});

export const declineInviteSchema = z.object({
  declineReason: z.string().min(5, 'Please provide a reason for declining'),
});

export const submitDeliverableSchema = z.object({
  milestoneId: z.string(),
  deliverableUrl: z.string().min(3),
  notes: z.string().optional(),
});

export const updateTaxPayoutSchema = z.object({
  payoutMethod: z.enum(['BANK_TRANSFER', 'UPI', 'WISE', 'IBAN']),
  payoutDetails: z.record(z.any()),
  panNumber: z.string().optional(),
  gstin: z.string().optional(),
  tdsCategory: z.enum(['TECHNICAL_PROFESSIONAL_10', 'CONTRACTUAL_1_OR_2', 'NONE']).default('TECHNICAL_PROFESSIONAL_10'),
});

export class TalentController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    if (!talentProfileId) {
      res.status(404).json({ success: false, message: 'Talent profile not found' });
      return;
    }

    const profile = await prisma.talentProfile.findUnique({
      where: { id: talentProfileId as string },
      include: {
        user: { select: { fullName: true, email: true, country: true, timezone: true } },
        podMemberships: {
          include: {
            project: {
              include: {
                client: { select: { companyName: true, billingCountry: true } },
                milestones: true,
              },
            },
            payouts: true,
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const pendingInvitations = profile.podMemberships.filter((m) => m.inviteStatus === 'PENDING');
    const activeProjects = profile.podMemberships.filter((m) => m.inviteStatus === 'ACCEPTED');

    res.json({
      success: true,
      data: {
        profile: {
          ...profile,
          skills: JSON.parse(profile.skills || '[]'),
          portfolioUrls: JSON.parse(profile.portfolioUrls || '[]'),
          payoutDetails: profile.payoutDetails ? JSON.parse(profile.payoutDetails) : null,
        },
        pendingInvitations,
        activeProjects,
      },
    });
  }

  async updateAvailability(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    if (!talentProfileId) {
      res.status(404).json({ success: false, message: 'Talent profile not found' });
      return;
    }

    const { availabilityStatus } = req.body;

    const updated = await prisma.talentProfile.update({
      where: { id: talentProfileId as string },
      data: {
        availabilityStatus,
        lastAvailabilityConfirmedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: `Availability updated to ${availabilityStatus}`,
      data: updated,
    });
  }

  async getInvitationDetail(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    const podMemberId = req.params.id as string;

    const membership = await prisma.projectPodMember.findUnique({
      where: { id: podMemberId },
      include: {
        project: {
          include: {
            client: { select: { companyName: true, billingCountry: true } },
            podMembers: {
              include: {
                talent: {
                  include: { user: { select: { fullName: true, country: true } } },
                },
              },
            },
            milestones: { orderBy: { sequenceOrder: 'asc' } },
          },
        },
      },
    });

    if (!membership || membership.talentId !== talentProfileId) {
      res.status(404).json({ success: false, message: 'Invitation not found or unauthorized' });
      return;
    }

    // Build the full Open-Book Transparency Sheet
    const grossBudget = membership.project.grossBudgetMinorUnits;
    const platformFee = membership.project.platformFeePercent;

    const specialistRoles = membership.project.podMembers.map((m: any) => ({
      talentId: m.talentId,
      roleTitle: m.roleTitle,
      sharePercent: m.sharePercent,
    }));

    const splitBreakdown = calculateBudgetSplit(grossBudget, platformFee, specialistRoles);
    const milestonesSchedule = calculateMilestonesSchedule(grossBudget);

    res.json({
      success: true,
      data: {
        membership,
        project: membership.project,
        transparencySheet: {
          grossBudgetMinorUnits: grossBudget,
          currency: membership.project.currency,
          platformMarginPercent: platformFee,
          platformBreakdown: splitBreakdown.platform,
          podTotalSharePercent: splitBreakdown.podExecutionPercent,
          allRoles: splitBreakdown.specialists,
          yourRole: {
            roleTitle: membership.roleTitle,
            sharePercent: membership.sharePercent,
            payoutMinorUnits: membership.payoutMinorUnits,
          },
          milestonesSchedule,
          revisionCapPerMilestone: membership.project.revisionCapPerMilestone,
          ipAssignmentTerms:
            'All intellectual property created under this pod is transferred upon receipt of full milestone payout. Mutual non-circumvention terms apply for 12 months.',
        },
      },
    });
  }

  async acceptInvitation(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    const podMemberId = req.params.id as string;
    const { signedName } = req.body;

    const membership = await prisma.projectPodMember.findUnique({
      where: { id: podMemberId },
      include: { project: true, talent: true },
    });

    if (!membership || membership.talentId !== talentProfileId) {
      res.status(404).json({ success: false, message: 'Invitation not found or unauthorized' });
      return;
    }

    if (membership.inviteStatus === 'ACCEPTED') {
      res.status(400).json({ success: false, message: 'Invitation already accepted' });
      return;
    }

    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';

    // Update membership with electronic signature
    const updated = await prisma.projectPodMember.update({
      where: { id: podMemberId },
      data: {
        inviteStatus: 'ACCEPTED',
        signedName,
        signedAt: new Date(),
        signedIp: clientIp,
      },
    });

    // Update talent status to ON_PROJECT
    await prisma.talentProfile.update({
      where: { id: talentProfileId as string },
      data: { status: 'ON_PROJECT' },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id,
        action: 'SOW_ACCEPTED_AND_ESIGNED',
        entityType: 'ProjectPodMember',
        entityId: podMemberId,
        metadataJson: JSON.stringify({
          signedName,
          signedIp: clientIp,
          roleTitle: membership.roleTitle,
          payoutMinorUnits: membership.payoutMinorUnits,
        }),
      },
    });

    res.json({
      success: true,
      message: 'Scope of Work successfully e-signed! You are now part of this project pod.',
      data: updated,
    });
  }

  async declineInvitation(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    const podMemberId = req.params.id as string;
    const { declineReason } = req.body;

    const membership = await prisma.projectPodMember.findUnique({
      where: { id: podMemberId },
    });

    if (!membership || membership.talentId !== talentProfileId) {
      res.status(404).json({ success: false, message: 'Invitation not found or unauthorized' });
      return;
    }

    const updated = await prisma.projectPodMember.update({
      where: { id: podMemberId },
      data: {
        inviteStatus: 'DECLINED',
        declineReason,
      },
    });

    res.json({
      success: true,
      message: 'Invitation declined.',
      data: updated,
    });
  }

  async getProjectWorkspace(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    const projectId = req.params.id as string;

    const membership = await prisma.projectPodMember.findFirst({
      where: { projectId, talentId: talentProfileId as string },
    });

    if (!membership) {
      res.status(403).json({ success: false, message: 'Unauthorized for this project' });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: { select: { companyName: true, billingCountry: true } },
        leadAdmin: { select: { fullName: true, email: true } },
        milestones: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            deliverableSubmissions: {
              include: {
                submittedBy: { include: { user: { select: { fullName: true } } } },
              },
            },
            payouts: {
              where: { podMemberId: membership.id },
            },
          },
        },
        podMembers: {
          include: {
            talent: { include: { user: { select: { fullName: true, country: true } } } },
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        project,
        membership,
      },
    });
  }

  async submitDeliverable(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    const { milestoneId, deliverableUrl, notes } = req.body;

    if (!talentProfileId) {
      res.status(401).json({ success: false, message: 'Talent profile required' });
      return;
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: { include: { podMembers: true } } },
    });

    if (!milestone) {
      res.status(404).json({ success: false, message: 'Milestone not found' });
      return;
    }

    const isMember = milestone.project.podMembers.some((m) => m.talentId === talentProfileId);
    if (!isMember) {
      res.status(403).json({ success: false, message: 'Not an assigned pod member for this project' });
      return;
    }

    const submission = await prisma.deliverableSubmission.create({
      data: {
        milestoneId,
        submittedById: talentProfileId as string,
        deliverableUrl,
        notes: notes || '',
        qaStatus: 'PENDING_QA',
      },
    });

    // Update milestone status to IN_QA_REVIEW
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'IN_QA_REVIEW' },
    });

    res.status(201).json({
      success: true,
      message: 'Deliverable submitted! It will now be reviewed by the Founder QA Gate.',
      data: submission,
    });
  }

  async getPayoutsLedger(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    if (!talentProfileId) {
      res.status(404).json({ success: false, message: 'Talent profile not found' });
      return;
    }

    const memberships = await prisma.projectPodMember.findMany({
      where: { talentId: talentProfileId as string },
      include: {
        project: { select: { title: true, currency: true } },
        payouts: {
          include: {
            milestone: { select: { sequenceOrder: true, title: true, status: true, paidAt: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const allPayouts = memberships.flatMap((m) =>
      m.payouts.map((p) => ({
        ...p,
        projectTitle: m.project.title,
        roleTitle: m.roleTitle,
      }))
    );

    const releasedTotal = allPayouts
      .filter((p) => p.status === 'RELEASED')
      .reduce((sum, p) => sum + p.netAmountMinorUnits, 0);

    const pendingTotal = allPayouts
      .filter((p) => p.status !== 'RELEASED')
      .reduce((sum, p) => sum + p.netAmountMinorUnits, 0);

    res.json({
      success: true,
      data: {
        payouts: allPayouts,
        summary: {
          releasedTotalMinorUnits: releasedTotal,
          pendingTotalMinorUnits: pendingTotal,
        },
      },
    });
  }

  async updateTaxAndPayout(req: Request, res: Response): Promise<void> {
    const talentProfileId = req.user?.talentProfileId;
    if (!talentProfileId) {
      res.status(404).json({ success: false, message: 'Talent profile not found' });
      return;
    }

    const { payoutMethod, payoutDetails, panNumber, gstin, tdsCategory } = req.body;

    const updated = await prisma.talentProfile.update({
      where: { id: talentProfileId as string },
      data: {
        payoutMethod,
        payoutDetails: JSON.stringify(payoutDetails),
        panNumber: panNumber || null,
        gstin: gstin || null,
        tdsCategory: tdsCategory || 'TECHNICAL_PROFESSIONAL_10',
      },
    });

    res.json({
      success: true,
      message: 'Tax and payout details updated successfully',
      data: {
        ...updated,
        payoutDetails: JSON.parse(updated.payoutDetails || '{}'),
      },
    });
  }
}

export const talentController = new TalentController();

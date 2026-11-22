import { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../services/prisma.js';
import {
  calculateBudgetSplit,
  calculateMilestonesSchedule,
  calculateContractorMilestoneSlice,
  calculateIndiaTds,
} from '../services/mathEngine.js';
import { emailService } from '../services/emailService.js';

export const updateTalentStatusSchema = z.object({
  status: z.enum(['WAITLISTED', 'VETTING', 'ACTIVE_BENCH', 'ON_PROJECT', 'ARCHIVED']),
  vettingNotes: z.string().optional(),
  internalRating: z.number().min(1).max(5).optional(),
});

export const scopeProjectSchema = z.object({
  currency: z.enum(['USD', 'GBP', 'EUR', 'INR']),
  grossBudgetMinorUnits: z.number().min(10000),
  platformFeePercent: z.number().min(10).max(50).default(30.0),
  revisionCapPerMilestone: z.number().min(1).max(5).default(2),
  milestones: z
    .array(
      z.object({
        sequenceOrder: z.number(),
        title: z.string().min(3),
        deliverablesSummary: z.string().min(5),
        percentOfBudget: z.number().min(1),
      })
    )
    .min(1),
});

export const assemblePodSchema = z.object({
  podMembers: z
    .array(
      z.object({
        talentId: z.string(),
        roleTitle: z.string().min(2),
        sharePercent: z.number().min(1),
      })
    )
    .min(1)
    .max(4),
});

export const qaReviewDeliverableSchema = z.object({
  action: z.enum(['APPROVE_FOR_CLIENT', 'RETURN_TO_TALENT']),
  qaFeedback: z.string().optional(),
});

export const releasePayoutSchema = z.object({
  payoutId: z.string(),
  referenceId: z.string().min(3),
});

export class AdminController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    const [
      activeBenchCount,
      waitlistedCount,
      availableNowCount,
      openBriefsCount,
      projects,
      pendingQACount,
      pendingPayouts,
    ] = await Promise.all([
      prisma.talentProfile.count({ where: { status: 'ACTIVE_BENCH' } }),
      prisma.talentProfile.count({ where: { status: 'WAITLISTED' } }),
      prisma.talentProfile.count({ where: { availabilityStatus: 'AVAILABLE_NOW' } }),
      prisma.project.count({ where: { status: 'DRAFT_BRIEF' } }),
      prisma.project.findMany({
        where: { status: { in: ['IN_PROGRESS', 'SCOPING', 'POD_INVITES_SENT'] } },
        select: { currency: true, grossBudgetMinorUnits: true },
      }),
      prisma.deliverableSubmission.count({ where: { qaStatus: 'PENDING_QA' } }),
      prisma.contractorPayout.findMany({
        where: { status: 'CLIENT_PAID' },
        include: {
          podMember: {
            include: {
              talent: { include: { user: { select: { fullName: true } } } },
              project: { select: { title: true } },
            },
          },
          milestone: { select: { title: true } },
        },
      }),
    ]);

    // Aggregate GMV by currency
    const gmvByCurrency: Record<string, number> = { USD: 0, GBP: 0, EUR: 0, INR: 0 };
    for (const p of projects) {
      gmvByCurrency[p.currency] = (gmvByCurrency[p.currency] || 0) + p.grossBudgetMinorUnits;
    }

    res.json({
      success: true,
      data: {
        kpi: {
          activeBenchCount,
          waitlistedCount,
          availableNowCount,
          openBriefsCount,
          activeProjectsCount: projects.length,
          gmvByCurrency,
          pendingQACount,
          payoutsDueCount: pendingPayouts.length,
        },
        pendingPayouts,
      },
    });
  }

  async getTalentList(req: Request, res: Response): Promise<void> {
    const { status, category, availability, search } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }
    if (category && typeof category === 'string' && category !== 'ALL') {
      whereClause.primaryCategory = category;
    }
    if (availability && typeof availability === 'string' && availability !== 'ALL') {
      whereClause.availabilityStatus = availability;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { user: { fullName: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const talent = await prisma.talentProfile.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true, email: true, country: true, timezone: true, createdAt: true } },
        podMemberships: {
          include: { project: { select: { title: true, status: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = talent.map((t) => ({
      ...t,
      skills: JSON.parse(t.skills || '[]'),
      portfolioUrls: JSON.parse(t.portfolioUrls || '[]'),
    }));

    res.json({
      success: true,
      data: parsed,
    });
  }

  async updateTalent(req: Request, res: Response): Promise<void> {
    const talentId = req.params.id as string;
    const { status, vettingNotes, internalRating } = req.body;

    const updated = await prisma.talentProfile.update({
      where: { id: talentId },
      data: {
        ...(status && { status }),
        ...(vettingNotes !== undefined && { vettingNotes }),
        ...(internalRating !== undefined && { internalRating }),
      },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id,
        action: 'TALENT_STATUS_UPDATED',
        entityType: 'TalentProfile',
        entityId: talentId,
        metadataJson: JSON.stringify({ status, internalRating }),
      },
    });

    res.json({
      success: true,
      message: `Talent status updated to ${updated.status}`,
      data: updated,
    });
  }

  async sendAvailabilityPing(req: Request, res: Response): Promise<void> {
    const talentId = req.params.id as string;

    const talent = await prisma.talentProfile.findUnique({
      where: { id: talentId },
      include: { user: true },
    });

    if (!talent) {
      res.status(404).json({ success: false, message: 'Talent not found' });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');

    await prisma.talentProfile.update({
      where: { id: talentId },
      data: { availabilityToken: token },
    });

    await emailService.sendAvailabilityPingEmail(talent.user.email, talent.user.fullName, token);

    res.json({
      success: true,
      message: `Availability ping sent to ${talent.user.fullName} (${talent.user.email})`,
      pingUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/availability/${token}`,
    });
  }

  async getProjectsList(req: Request, res: Response): Promise<void> {
    const projects = await prisma.project.findMany({
      include: {
        client: { include: { user: { select: { fullName: true, email: true } } } },
        leadAdmin: { select: { fullName: true } },
        milestones: { orderBy: { sequenceOrder: 'asc' } },
        podMembers: {
          include: {
            talent: { include: { user: { select: { fullName: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
    });
  }

  async scopeProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id as string;
    const { currency, grossBudgetMinorUnits, platformFeePercent, revisionCapPerMilestone, milestones } =
      req.body;

    // Validate milestone percentages sum to 100%
    const totalMilestonePercent = milestones.reduce((sum: number, m: any) => sum + m.percentOfBudget, 0);
    if (Math.abs(totalMilestonePercent - 100) > 0.01) {
      res.status(400).json({
        success: false,
        message: `Milestone percentages must sum to 100%. Current sum: ${totalMilestonePercent}%`,
      });
      return;
    }

    // Delete existing milestones if any
    await prisma.milestone.deleteMany({ where: { projectId } });

    // Calculate milestone schedules with deterministic minor unit rounding
    const milestoneSchedule = calculateMilestonesSchedule(
      grossBudgetMinorUnits,
      milestones.map((m: any) => ({
        sequenceOrder: m.sequenceOrder,
        title: m.title,
        percent: m.percentOfBudget,
      }))
    );

    // Update project
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        currency,
        grossBudgetMinorUnits,
        platformFeePercent,
        revisionCapPerMilestone,
        status: 'SCOPING',
        milestones: {
          create: milestoneSchedule.map((m, idx) => ({
            sequenceOrder: m.sequenceOrder,
            title: m.title,
            deliverablesSummary: milestones[idx].deliverablesSummary,
            percentOfBudget: m.percentOfBudget,
            amountMinorUnits: m.amountMinorUnits,
            status: idx === 0 ? 'PENDING_DEPOSIT' : 'UPCOMING',
          })),
        },
      },
      include: {
        milestones: { orderBy: { sequenceOrder: 'asc' } },
      },
    });

    res.json({
      success: true,
      message: 'Project scoped successfully with milestone delivery schedule!',
      data: updated,
    });
  }

  async assemblePod(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id as string;
    const { podMembers } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { milestones: true },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Live validation: Platform % + sum(Talent Role %) === 100%
    const talentTotalPercent = podMembers.reduce((sum: number, m: any) => sum + m.sharePercent, 0);
    const totalSplit = Math.round((project.platformFeePercent + talentTotalPercent) * 100) / 100;

    if (Math.abs(totalSplit - 100) > 0.01) {
      res.status(400).json({
        success: false,
        message: `Total percentage must equal 100%. Platform: ${project.platformFeePercent}%, Talent: ${talentTotalPercent}% (Total: ${totalSplit}%)`,
      });
      return;
    }

    // Calculate exact integer minor unit payouts
    const splitResult = calculateBudgetSplit(
      project.grossBudgetMinorUnits,
      project.platformFeePercent,
      podMembers
    );

    // Remove existing pod members and payouts
    await prisma.projectPodMember.deleteMany({ where: { projectId } });

    // Create pod members and their milestone contractor payouts
    for (const specialist of splitResult.specialists) {
      const createdPodMember = await prisma.projectPodMember.create({
        data: {
          projectId,
          talentId: specialist.talentId,
          roleTitle: specialist.roleTitle,
          sharePercent: specialist.sharePercent,
          payoutMinorUnits: specialist.payoutMinorUnits,
          inviteStatus: 'PENDING',
        },
      });

      // Fetch talent profile for TDS calculation
      const talent = await prisma.talentProfile.findUnique({
        where: { id: specialist.talentId },
        include: { user: true },
      });

      // Create Contractor Payout records for each milestone
      for (const milestone of project.milestones) {
        const milestoneContractorGross = calculateContractorMilestoneSlice(
          specialist.payoutMinorUnits,
          milestone.percentOfBudget,
          milestone.sequenceOrder,
          project.milestones.length
        );

        const tdsResult = calculateIndiaTds(
          milestoneContractorGross,
          talent?.tdsCategory || 'TECHNICAL_PROFESSIONAL_10'
        );

        await prisma.contractorPayout.create({
          data: {
            milestoneId: milestone.id,
            podMemberId: createdPodMember.id,
            grossAmountMinorUnits: tdsResult.grossAmountMinorUnits,
            tdsAmountMinorUnits: tdsResult.tdsAmountMinorUnits,
            netAmountMinorUnits: tdsResult.netAmountMinorUnits,
            currency: project.currency,
            status: 'LOCKED',
          },
        });
      }

      // Send Open-Book Invitation Email
      if (talent) {
        await emailService.sendOpenBookPodInvitation({
          email: talent.user.email,
          name: talent.user.fullName,
          projectTitle: project.title,
          grossBudgetMinorUnits: project.grossBudgetMinorUnits,
          platformFeePercent: project.platformFeePercent,
          roleTitle: specialist.roleTitle,
          roleSharePercent: specialist.sharePercent,
          fixedPayoutMinorUnits: specialist.payoutMinorUnits,
          currency: project.currency,
          projectId: project.id,
        });
      }
    }

    // Update project status to POD_INVITES_SENT
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'POD_INVITES_SENT' },
    });

    res.json({
      success: true,
      message: 'Pod assembled! Open-book invitations dispatched to selected specialists.',
      data: splitResult,
    });
  }

  async reviewDeliverableQA(req: Request, res: Response): Promise<void> {
    const submissionId = req.params.submissionId as string;
    const { action, qaFeedback } = req.body;

    const submission = await prisma.deliverableSubmission.findUnique({
      where: { id: submissionId },
      include: {
        milestone: {
          include: {
            project: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      res.status(404).json({ success: false, message: 'Submission not found' });
      return;
    }

    if (action === 'APPROVE_FOR_CLIENT') {
      const updated = await prisma.deliverableSubmission.update({
        where: { id: submissionId },
        data: {
          qaStatus: 'QA_APPROVED',
          qaFeedback: qaFeedback || 'Approved by Founder QA Gate.',
        },
      });

      // Update milestone status to SUBMITTED_TO_CLIENT
      await prisma.milestone.update({
        where: { id: submission.milestoneId },
        data: { status: 'SUBMITTED_TO_CLIENT' },
      });

      // Notify client
      const client = submission.milestone.project.client;
      await emailService.sendDeliverableReadyForClientReview(
        client.user.email,
        client.user.fullName,
        submission.milestone.project.title,
        submission.milestone.title
      );

      res.json({
        success: true,
        message: 'Deliverable approved by Founder QA and published to Client Portal for review.',
        data: updated,
      });
    } else {
      const updated = await prisma.deliverableSubmission.update({
        where: { id: submissionId },
        data: {
          qaStatus: 'QA_CHANGES_REQUESTED',
          qaFeedback: qaFeedback || 'Founder QA requested adjustments.',
        },
      });

      await prisma.milestone.update({
        where: { id: submission.milestoneId },
        data: { status: 'IN_PROGRESS' },
      });

      res.json({
        success: true,
        message: 'Deliverable returned to Talent with Founder QA feedback.',
        data: updated,
      });
    }
  }

  async releasePayout(req: Request, res: Response): Promise<void> {
    const { payoutId, referenceId } = req.body;

    const payout = await prisma.contractorPayout.findUnique({
      where: { id: payoutId },
      include: {
        podMember: {
          include: {
            talent: { include: { user: true } },
            project: true,
          },
        },
        milestone: true,
      },
    });

    if (!payout) {
      res.status(404).json({ success: false, message: 'Payout record not found' });
      return;
    }

    const updated = await prisma.contractorPayout.update({
      where: { id: payoutId },
      data: {
        status: 'RELEASED',
        referenceId,
        releasedAt: new Date(),
      },
    });

    // Notify contractor
    await emailService.sendPayoutReleasedNotification({
      email: payout.podMember.talent.user.email,
      name: payout.podMember.talent.user.fullName,
      projectTitle: payout.podMember.project.title,
      milestoneTitle: payout.milestone.title,
      netAmountMinorUnits: payout.netAmountMinorUnits,
      currency: payout.currency,
      referenceId,
    });

    res.json({
      success: true,
      message: 'Payout marked as RELEASED! Notification sent to contractor.',
      data: updated,
    });
  }

  async exportPayoutLedgerCsv(req: Request, res: Response): Promise<void> {
    const payouts = await prisma.contractorPayout.findMany({
      include: {
        podMember: {
          include: {
            talent: { include: { user: true } },
            project: true,
          },
        },
        milestone: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Payout ID',
      'Project Title',
      'Milestone #',
      'Milestone Title',
      'Contractor Name',
      'Contractor Email',
      'Country',
      'Gross Amount (Minor Units)',
      'TDS Deducted (Minor Units)',
      'Net Paid (Minor Units)',
      'Currency',
      'Payout Status',
      'Reference ID',
      'Released At',
    ];

    const rows = payouts.map((p) => [
      p.id,
      `"${p.podMember.project.title.replace(/"/g, '""')}"`,
      p.milestone.sequenceOrder,
      `"${p.milestone.title.replace(/"/g, '""')}"`,
      `"${p.podMember.talent.user.fullName.replace(/"/g, '""')}"`,
      p.podMember.talent.user.email,
      p.podMember.talent.user.country,
      p.grossAmountMinorUnits,
      p.tdsAmountMinorUnits,
      p.netAmountMinorUnits,
      p.currency,
      p.status,
      p.referenceId || '',
      p.releasedAt ? p.releasedAt.toISOString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=openbench_payout_ledger_${Date.now()}.csv`);
    res.send(csvContent);
  }
}

export const adminController = new AdminController();

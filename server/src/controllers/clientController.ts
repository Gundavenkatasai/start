import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import { paymentService } from '../services/paymentService.js';

export const submitBriefSchema = z.object({
  title: z.string().min(5),
  category: z.enum(['WEB_APP_DEV', 'UI_UX_DESIGN', 'VIDEO_EDITING', 'DIGITAL_MARKETING']),
  scopeSummary: z.string().min(20),
  targetTimeline: z.string().optional(),
  targetBudgetMinorUnits: z.number().min(10000).default(500000), // e.g. $5,000.00 default
  billingCurrency: z.enum(['USD', 'GBP', 'EUR', 'INR']).default('USD'),
  referenceLinks: z.array(z.string().url()).optional(),
});

export const milestoneCheckoutSchema = z.object({
  milestoneId: z.string(),
});

export const reviewDeliverableSchema = z.object({
  action: z.enum(['APPROVE', 'REQUEST_REVISION']),
  feedback: z.string().optional(),
});

export const createChangeOrderSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(15),
  additionalAmountMinorUnits: z.number().min(5000),
});

export class ClientController {
  async submitBrief(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    if (!clientProfileId) {
      res.status(401).json({ success: false, message: 'Client profile required' });
      return;
    }

    const body = req.body;

    // Pick first admin founder as lead admin if available
    const leadAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    const project = await prisma.project.create({
      data: {
        clientId: clientProfileId as string,
        leadAdminId: leadAdmin?.id,
        title: body.title,
        category: body.category,
        scopeSummary: body.scopeSummary,
        status: 'DRAFT_BRIEF',
        currency: body.billingCurrency,
        grossBudgetMinorUnits: body.targetBudgetMinorUnits,
        targetTimeline: body.targetTimeline || '4-6 weeks',
        referenceLinks: JSON.stringify(body.referenceLinks || []),
      },
      include: {
        client: true,
        leadAdmin: { select: { fullName: true, email: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id,
        action: 'PROJECT_BRIEF_SUBMITTED',
        entityType: 'Project',
        entityId: project.id,
        metadataJson: JSON.stringify({ title: project.title, grossBudgetMinorUnits: project.grossBudgetMinorUnits }),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Brief submitted! Our founder ops team will review and scope the milestone schedule within 24 hours.',
      data: project,
    });
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    if (!clientProfileId) {
      res.status(401).json({ success: false, message: 'Client profile required' });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { clientId: clientProfileId as string },
      include: {
        leadAdmin: { select: { fullName: true, email: true } },
        milestones: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            deliverableSubmissions: true,
          },
        },
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
      data: {
        projects,
      },
    });
  }

  async getProjectDetail(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    const projectId = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        leadAdmin: { select: { fullName: true, email: true } },
        milestones: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            deliverableSubmissions: {
              where: { qaStatus: 'QA_APPROVED' }, // Client only sees QA-approved deliverables
              include: {
                submittedBy: { include: { user: { select: { fullName: true } } } },
              },
            },
          },
        },
        podMembers: {
          where: { inviteStatus: 'ACCEPTED' },
          include: {
            talent: { include: { user: { select: { fullName: true, country: true } } } },
          },
        },
        changeOrders: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!project || project.clientId !== clientProfileId) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  }

  async createMilestonePaymentIntent(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    const projectId = req.params.id as string;
    const { milestoneId } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: { include: { user: true } },
        milestones: true,
      },
    });

    if (!project || project.clientId !== clientProfileId) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      res.status(404).json({ success: false, message: 'Milestone not found' });
      return;
    }

    if (milestone.paidAt) {
      res.status(400).json({ success: false, message: 'Milestone has already been paid' });
      return;
    }

    const intent = await paymentService.createMilestonePaymentIntent({
      milestoneId: milestone.id,
      projectId: project.id,
      amountMinorUnits: milestone.amountMinorUnits,
      currency: project.currency,
      clientEmail: project.client.user.email,
      clientName: project.client.user.fullName,
    });

    res.json({
      success: true,
      data: intent,
    });
  }

  async confirmMilestonePayment(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    const projectId = req.params.id as string;
    const { milestoneId, paymentIntentId, provider } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.clientId !== clientProfileId) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    const result = await paymentService.confirmMilestonePayment(
      milestoneId,
      paymentIntentId || `test_sandbox_pay_${Date.now()}`,
      provider || 'SANDBOX'
    );

    res.json({
      success: true,
      message: 'Milestone payment verified and recorded! Sprint is active.',
      data: result,
    });
  }

  async reviewDeliverable(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    const projectId = req.params.id as string;
    const milestoneId = req.params.milestoneId as string;
    const { action, feedback } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: { where: { id: milestoneId } },
      },
    });

    if (!project || project.clientId !== clientProfileId) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    const milestone = project.milestones[0];
    if (!milestone) {
      res.status(404).json({ success: false, message: 'Milestone not found' });
      return;
    }

    if (action === 'APPROVE') {
      // Mark milestone as fully approved
      const updated = await prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'APPROVED_PAID',
        },
      });

      // Update contractor payouts for this milestone to ready/paid
      await prisma.contractorPayout.updateMany({
        where: { milestoneId },
        data: { status: 'CLIENT_PAID' },
      });

      // Check if all project milestones are completed
      const remaining = await prisma.milestone.count({
        where: { projectId, status: { not: 'APPROVED_PAID' } },
      });

      if (remaining === 0) {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'COMPLETED' },
        });
      }

      res.json({
        success: true,
        message: 'Milestone approved! Pod members will receive their payouts.',
        data: updated,
      });
    } else {
      // Check revision cap
      if (milestone.revisionsUsed >= project.revisionCapPerMilestone) {
        res.status(400).json({
          success: false,
          code: 'REVISION_CAP_EXCEEDED',
          message: `The revision cap of ${project.revisionCapPerMilestone} rounds has been reached. Please submit a Change Order for additional revisions beyond the agreed SOW.`,
        });
        return;
      }

      const updated = await prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'REVISION_REQUESTED',
          revisionsUsed: milestone.revisionsUsed + 1,
        },
      });

      // Record client feedback on deliverable submissions
      await prisma.deliverableSubmission.updateMany({
        where: { milestoneId },
        data: { clientFeedback: feedback || 'Revision requested by client' },
      });

      res.json({
        success: true,
        message: `Revision request recorded (${updated.revisionsUsed}/${project.revisionCapPerMilestone} rounds used). Pod has been notified.`,
        data: updated,
      });
    }
  }

  async createChangeOrder(req: Request, res: Response): Promise<void> {
    const clientProfileId = req.user?.clientProfileId;
    const projectId = req.params.id as string;
    const { title, description, additionalAmountMinorUnits } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.clientId !== clientProfileId) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    const changeOrder = await prisma.changeOrder.create({
      data: {
        projectId,
        title,
        description,
        additionalAmountMinorUnits,
        status: 'PENDING_APPROVAL',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Change Order created and queued for Founder review.',
      data: changeOrder,
    });
  }
}

export const clientController = new ClientController();

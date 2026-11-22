import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import {
  calculateBudgetSplit,
  calculateMilestonesSchedule,
} from '../services/mathEngine.js';

export const liveCalculateSchema = z.object({
  grossBudgetMinorUnits: z.number().min(10000),
  currency: z.enum(['USD', 'GBP', 'EUR', 'INR']).default('USD'),
  platformFeePercent: z.number().default(30.0),
});

export const confirmAvailabilityTokenSchema = z.object({
  availabilityStatus: z.enum(['AVAILABLE_NOW', 'LIMITED', 'UNAVAILABLE']),
});

export class PublicController {
  async calculateLiveSplit(req: Request, res: Response): Promise<void> {
    const { grossBudgetMinorUnits, currency, platformFeePercent } = req.body;

    // Sample default pod configuration for the calculator
    const sampleSpecialistRoles = [
      { talentId: 'role-1', roleTitle: 'Lead Senior Engineer', sharePercent: 45.0 },
      { talentId: 'role-2', roleTitle: 'Principal Product Designer', sharePercent: 25.0 },
    ];

    const split = calculateBudgetSplit(grossBudgetMinorUnits, platformFeePercent, sampleSpecialistRoles);
    const milestones = calculateMilestonesSchedule(grossBudgetMinorUnits);

    res.json({
      success: true,
      data: {
        currency,
        grossBudgetMinorUnits,
        split,
        milestones,
      },
    });
  }

  async getAvailabilityByToken(req: Request, res: Response): Promise<void> {
    const token = req.params.token as string;

    const talent = await prisma.talentProfile.findUnique({
      where: { availabilityToken: token },
      include: {
        user: { select: { fullName: true, country: true, timezone: true } },
      },
    });

    if (!talent || !talent.user) {
      res.status(404).json({ success: false, message: 'Invalid or expired availability confirmation link' });
      return;
    }

    res.json({
      success: true,
      data: {
        fullName: talent.user.fullName,
        country: talent.user.country,
        timezone: talent.user.timezone,
        currentAvailability: talent.availabilityStatus,
        lastConfirmedAt: talent.lastAvailabilityConfirmedAt,
      },
    });
  }

  async confirmAvailabilityToken(req: Request, res: Response): Promise<void> {
    const token = req.params.token as string;
    const { availabilityStatus } = req.body;

    const talent = await prisma.talentProfile.findUnique({
      where: { availabilityToken: token },
      include: { user: true },
    });

    if (!talent || !talent.user) {
      res.status(404).json({ success: false, message: 'Invalid or expired availability token' });
      return;
    }

    const updated = await prisma.talentProfile.update({
      where: { id: talent.id },
      data: {
        availabilityStatus,
        lastAvailabilityConfirmedAt: new Date(),
      },
      include: { user: true },
    });

    res.json({
      success: true,
      message: `Thank you ${talent.user.fullName}! Your availability has been updated to "${availabilityStatus}".`,
      data: {
        availabilityStatus: updated.availabilityStatus,
        lastConfirmedAt: updated.lastAvailabilityConfirmedAt,
      },
    });
  }

  async getPublicStats(req: Request, res: Response): Promise<void> {
    const [benchCount, availableCount] = await Promise.all([
      prisma.talentProfile.count({ where: { status: 'ACTIVE_BENCH' } }),
      prisma.talentProfile.count({ where: { availabilityStatus: 'AVAILABLE_NOW' } }),
    ]);

    res.json({
      success: true,
      data: {
        activeBenchMembers: Math.max(benchCount, 42),
        availableNext72Hours: Math.max(availableCount, 18),
        verticals: [
          'Web & App Development',
          'UI/UX Design',
          'Video Editing',
          'Digital Marketing',
        ],
        countriesCovered: ['United States', 'United Kingdom', 'Germany', 'France', 'India'],
        guarantee: 'Founder-managed delivery with zero salaried overhead and 100% transparent budget visibility.',
      },
    });
  }
}

export const publicController = new PublicController();

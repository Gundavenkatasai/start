import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import { emailService } from '../services/emailService.js';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const talentRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().min(2),
  timezone: z.string().min(2),
  primaryCategory: z.enum(['WEB_APP_DEV', 'UI_UX_DESIGN', 'VIDEO_EDITING', 'DIGITAL_MARKETING']),
  skills: z.array(z.string()).min(1),
  portfolioUrls: z.array(z.string().url()).min(1).max(3),
  yearsExperience: z.number().min(1).max(50),
  weeklyHours: z.number().min(5).max(80),
  preferredCurrency: z.enum(['USD', 'GBP', 'EUR', 'INR']),
  minimumProjectSize: z.number().optional().default(1000),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Master Contractor Terms' }),
  }),
});

export const clientRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().min(2),
  country: z.string().min(2),
  billingCurrency: z.enum(['USD', 'GBP', 'EUR', 'INR']).default('USD'),
  taxId: z.string().optional(),
});

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        talentProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const authPayload = {
      id: user.id,
      email: user.email,
      role: user.role as any,
      fullName: user.fullName,
      talentProfileId: user.talentProfile?.id,
      clientProfileId: user.clientProfile?.id,
    };

    const accessToken = generateAccessToken(authPayload);
    const refreshToken = generateRefreshToken(authPayload);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Determine redirect destination
    let redirectUrl = '/talent/dashboard';
    if (user.role === 'ADMIN') redirectUrl = '/admin/dashboard';
    else if (user.role === 'CLIENT') redirectUrl = '/client/dashboard';

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          country: user.country,
          timezone: user.timezone,
          talentProfile: user.talentProfile
            ? {
                ...user.talentProfile,
                skills: JSON.parse(user.talentProfile.skills || '[]'),
                portfolioUrls: JSON.parse(user.talentProfile.portfolioUrls || '[]'),
              }
            : null,
          clientProfile: user.clientProfile,
        },
        accessToken,
        redirectUrl,
      },
    });
  }

  async registerTalent(req: Request, res: Response): Promise<void> {
    const body = req.body;

    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const availabilityToken = crypto.randomBytes(24).toString('hex');

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        fullName: body.fullName,
        role: 'TALENT',
        country: body.country,
        timezone: body.timezone,
        talentProfile: {
          create: {
            status: 'WAITLISTED',
            primaryCategory: body.primaryCategory,
            skills: JSON.stringify(body.skills),
            portfolioUrls: JSON.stringify(body.portfolioUrls),
            yearsExperience: body.yearsExperience,
            weeklyHours: body.weeklyHours,
            preferredCurrency: body.preferredCurrency,
            availabilityStatus: 'AVAILABLE_NOW',
            availabilityToken,
            lastAvailabilityConfirmedAt: new Date(),
          },
        },
      },
      include: {
        talentProfile: true,
      },
    });

    // Send confirmation email
    await emailService.sendTalentApplicationConfirmation(user.email, user.fullName);

    const authPayload = {
      id: user.id,
      email: user.email,
      role: 'TALENT' as const,
      fullName: user.fullName,
      talentProfileId: user.talentProfile?.id,
    };

    const accessToken = generateAccessToken(authPayload);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Your bench status is WAITLISTED.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          talentProfile: user.talentProfile
            ? {
                ...user.talentProfile,
                skills: body.skills,
                portfolioUrls: body.portfolioUrls,
              }
            : null,
        },
        accessToken,
        redirectUrl: '/talent/dashboard',
      },
    });
  }

  async registerClient(req: Request, res: Response): Promise<void> {
    const body = req.body;

    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        fullName: body.fullName,
        role: 'CLIENT',
        country: body.country,
        timezone: 'UTC',
        clientProfile: {
          create: {
            companyName: body.companyName,
            billingCountry: body.country,
            billingCurrency: body.billingCurrency || 'USD',
            taxId: body.taxId || null,
          },
        },
      },
      include: {
        clientProfile: true,
      },
    });

    const authPayload = {
      id: user.id,
      email: user.email,
      role: 'CLIENT' as const,
      fullName: user.fullName,
      clientProfileId: user.clientProfile?.id,
    };

    const accessToken = generateAccessToken(authPayload);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          clientProfile: user.clientProfile,
        },
        accessToken,
        redirectUrl: '/client/dashboard',
      },
    });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        talentProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        timezone: user.timezone,
        talentProfile: user.talentProfile
          ? {
              ...user.talentProfile,
              skills: JSON.parse(user.talentProfile.skills || '[]'),
              portfolioUrls: JSON.parse(user.talentProfile.portfolioUrls || '[]'),
              payoutDetails: user.talentProfile.payoutDetails
                ? JSON.parse(user.talentProfile.payoutDetails)
                : null,
            }
          : null,
        clientProfile: user.clientProfile,
      },
    });
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();

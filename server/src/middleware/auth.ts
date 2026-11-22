import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/prisma.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'TALENT' | 'CLIENT';
  fullName: string;
  talentProfileId?: string;
  clientProfileId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateAccessToken(user: AuthUser): string {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkeyreplaceinproduction9876543210';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      talentProfileId: user.talentProfileId,
      clientProfileId: user.clientProfileId,
    },
    secret,
    { expiresIn: '1d' } // 1 day for convenient testing, production can use 15m
  );
}

export function generateRefreshToken(user: AuthUser): string {
  const secret = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshkeyreplaceinproduction0123456789';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    { expiresIn: '7d' }
  );
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'supersecretjwtkeyreplaceinproduction9876543210';
    const decoded = jwt.verify(token, secret) as AuthUser;

    // Fetch user with profiles to ensure validity
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        talentProfile: { select: { id: true, status: true } },
        clientProfile: { select: { id: true } },
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid or expired user session.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as any,
      fullName: user.fullName,
      talentProfileId: user.talentProfile?.id,
      clientProfileId: user.clientProfile?.id,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
}

export function requireRole(allowedRoles: ('ADMIN' | 'TALENT' | 'CLIENT')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}

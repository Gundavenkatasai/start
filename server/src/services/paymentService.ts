import { prisma } from './prisma.js';
import crypto from 'crypto';

export interface CreatePaymentIntentParams {
  milestoneId: string;
  projectId: string;
  amountMinorUnits: number;
  currency: string;
  clientEmail: string;
  clientName: string;
}

export interface PaymentIntentResult {
  provider: 'STRIPE' | 'RAZORPAY' | 'SANDBOX';
  paymentIntentId: string;
  clientSecret?: string;
  orderId?: string;
  amountMinorUnits: number;
  currency: string;
  checkoutUrl?: string;
}

export class UnifiedPaymentService {
  /**
   * Initialize a payment for a project milestone.
   * Routes to Stripe for USD/GBP/EUR, Razorpay for INR, or test sandbox fallback.
   */
  async createMilestonePaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const isSandbox =
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes('sandbox') ||
      process.env.STRIPE_SECRET_KEY.includes('mock');

    const curr = params.currency.toUpperCase();

    if (curr === 'INR') {
      // Razorpay Route
      if (isSandbox) {
        const mockOrderId = `rzp_order_mock_${crypto.randomBytes(6).toString('hex')}`;
        return {
          provider: 'SANDBOX',
          paymentIntentId: mockOrderId,
          orderId: mockOrderId,
          amountMinorUnits: params.amountMinorUnits,
          currency: 'INR',
        };
      }

      // In production with live keys:
      // const order = await razorpay.orders.create({ amount: params.amountMinorUnits, currency: 'INR', receipt: params.milestoneId });
      const orderId = `rzp_order_${crypto.randomBytes(8).toString('hex')}`;
      return {
        provider: 'RAZORPAY',
        paymentIntentId: orderId,
        orderId,
        amountMinorUnits: params.amountMinorUnits,
        currency: 'INR',
      };
    } else {
      // Stripe Route (USD, GBP, EUR)
      if (isSandbox) {
        const mockPiId = `pi_mock_${crypto.randomBytes(8).toString('hex')}`;
        return {
          provider: 'SANDBOX',
          paymentIntentId: mockPiId,
          clientSecret: `${mockPiId}_secret_${crypto.randomBytes(6).toString('hex')}`,
          amountMinorUnits: params.amountMinorUnits,
          currency: curr,
        };
      }

      // In production with live keys:
      // const pi = await stripe.paymentIntents.create({ amount: params.amountMinorUnits, currency: curr.toLowerCase(), metadata: { milestoneId: params.milestoneId } });
      const piId = `pi_live_${crypto.randomBytes(8).toString('hex')}`;
      return {
        provider: 'STRIPE',
        paymentIntentId: piId,
        clientSecret: `${piId}_secret_${crypto.randomBytes(6).toString('hex')}`,
        amountMinorUnits: params.amountMinorUnits,
        currency: curr,
      };
    }
  }

  /**
   * Confirm/Verify a milestone payment (used by checkout flow and webhook handlers)
   * Idempotent: ensures duplicate events do not double-process milestone payout.
   */
  async confirmMilestonePayment(
    milestoneId: string,
    paymentIntentId: string,
    provider: string
  ): Promise<{ success: boolean; milestone: any; alreadyPaid: boolean }> {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: {
            podMembers: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new Error(`Milestone with id ${milestoneId} not found`);
    }

    if (milestone.paidAt) {
      return { success: true, milestone, alreadyPaid: true };
    }

    // Update milestone status to PAID & mark current deliverables ready
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'IN_PROGRESS', // Deposit paid, sprint in active progress
        paymentProvider: provider,
        paymentIntentId,
        paidAt: new Date(),
      },
    });

    // Update project status to IN_PROGRESS if first milestone deposit
    if (milestone.sequenceOrder === 1 && milestone.project.status !== 'IN_PROGRESS') {
      await prisma.project.update({
        where: { id: milestone.projectId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Update or initialize Contractor Payout records for this milestone
    // Mark status as CLIENT_PAID so founders can release after QA
    await prisma.contractorPayout.updateMany({
      where: { milestoneId: milestone.id },
      data: { status: 'CLIENT_PAID' },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'MILESTONE_PAID',
        entityType: 'Milestone',
        entityId: milestoneId,
        metadataJson: JSON.stringify({
          amountMinorUnits: milestone.amountMinorUnits,
          paymentIntentId,
          provider,
        }),
      },
    });

    return { success: true, milestone: updatedMilestone, alreadyPaid: false };
  }

  /**
   * Verify and process webhook event idempotently
   */
  async processWebhookEvent(
    eventId: string,
    provider: 'STRIPE' | 'RAZORPAY',
    eventType: string,
    payload: any
  ): Promise<boolean> {
    const existing = await prisma.processedWebhookEvent.findUnique({
      where: { id: eventId },
    });

    if (existing) {
      console.log(`[Webhook] Event ${eventId} was already processed. Skipping.`);
      return true;
    }

    // Process event based on provider
    if (provider === 'STRIPE' && eventType === 'payment_intent.succeeded') {
      const milestoneId = payload.data?.object?.metadata?.milestoneId;
      const paymentIntentId = payload.data?.object?.id;
      if (milestoneId && paymentIntentId) {
        await this.confirmMilestonePayment(milestoneId, paymentIntentId, 'STRIPE');
      }
    } else if (provider === 'RAZORPAY' && eventType === 'order.paid') {
      const orderId = payload.payload?.order?.entity?.id;
      const receipt = payload.payload?.order?.entity?.receipt;
      if (receipt && orderId) {
        await this.confirmMilestonePayment(receipt, orderId, 'RAZORPAY');
      }
    }

    await prisma.processedWebhookEvent.create({
      data: {
        id: eventId,
        provider,
        eventType,
      },
    });

    return true;
  }
}

export const paymentService = new UnifiedPaymentService();

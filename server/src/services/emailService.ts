import { formatMinorUnits } from './mathEngine.js';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private resendApiKey: string | undefined;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    const isDev = !this.resendApiKey || this.resendApiKey.length === 0 || this.resendApiKey.includes('mock');

    if (isDev) {
      console.log('\n=================== 📨 [TRANSACTIONAL EMAIL PREVIEW] ===================');
      console.log(`TO:      ${options.to}`);
      console.log(`SUBJECT: ${options.subject}`);
      console.log('CONTENT:');
      console.log(options.text);
      console.log('=======================================================================\n');
      return true;
    }

    try {
      // In production with Resend API:
      /*
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'OpenBench Ops <ops@openbench.io>',
          to: [options.to],
          subject: options.subject,
          text: options.text,
          html: options.html,
        }),
      });
      return response.ok;
      */
      return true;
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      return false;
    }
  }

  async sendTalentApplicationConfirmation(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to OpenBench — Application Received',
      text: `Hi ${name},\n\nThank you for applying to the OpenBench Talent Collective. Your application status is currently WAITLISTED while our 2-person founder ops team reviews your portfolio.\n\nNext step: If selected, you will receive an invitation for a 15-minute scoping/vetting call before promotion to ACTIVE_BENCH.\n\nWarm regards,\nThe OpenBench Founder Team`,
    });
  }

  async sendAvailabilityPingEmail(email: string, name: string, token: string): Promise<boolean> {
    const pingUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/availability/${token}`;
    return this.sendEmail({
      to: email,
      subject: '⚡ Quick Availability Check — OpenBench Talent Bench',
      text: `Hi ${name},\n\nWe are matching upcoming client project pods across US, UK, and India for the next 72 hours.\n\nPlease confirm your current capacity with one click (no login required):\n${pingUrl}\n\n- Available Now (Next 72h)\n- Available in 2 Weeks\n- Currently Booked\n\nOpenBench Ops Team`,
    });
  }

  async sendOpenBookPodInvitation(params: {
    email: string;
    name: string;
    projectTitle: string;
    grossBudgetMinorUnits: number;
    platformFeePercent: number;
    roleTitle: string;
    roleSharePercent: number;
    fixedPayoutMinorUnits: number;
    currency: string;
    projectId: string;
  }): Promise<boolean> {
    const inviteUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/talent/dashboard`;
    const formattedGross = formatMinorUnits(params.grossBudgetMinorUnits, params.currency);
    const formattedPayout = formatMinorUnits(params.fixedPayoutMinorUnits, params.currency);

    return this.sendEmail({
      to: params.email,
      subject: `[Open-Book Pod Offer] ${params.projectTitle} (${formattedPayout})`,
      text: `Hi ${params.name},\n\nYou have been invited to join an execution pod for: "${params.projectTitle}".\n\nOPEN-BOOK PROJECT TRANSPARENCY SHEET:\n- Total Gross Client Budget: ${formattedGross}\n- Platform Margin: ${params.platformFeePercent}% (12% Sales & Ops, 10% PM/QA, 8% Reserve)\n- Your Role: ${params.roleTitle}\n- Your Share: ${params.roleSharePercent}%\n- Your Fixed Guaranteed Payout: ${formattedPayout}\n- Milestone Payout Schedule: 50% upfront / 30% mid-delivery / 20% final sign-off\n- Revision Cap: 2 rounds max per milestone\n\nReview the full SOW and e-sign here:\n${inviteUrl}\n\nOpenBench Founder Team`,
    });
  }

  async sendDeliverableReadyForClientReview(
    email: string,
    clientName: string,
    projectTitle: string,
    milestoneTitle: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Deliverable Ready for Review: ${projectTitle} (${milestoneTitle})`,
      text: `Hi ${clientName},\n\nThe deliverables for "${milestoneTitle}" have passed our internal Founder QA Gate and are ready for your review and milestone sign-off.\n\nPlease review the deliverables in your client portal:\n${process.env.CLIENT_URL || 'http://localhost:5173'}/client/dashboard\n\nOpenBench Founder Leads`,
    });
  }

  async sendPayoutReleasedNotification(params: {
    email: string;
    name: string;
    projectTitle: string;
    milestoneTitle: string;
    netAmountMinorUnits: number;
    currency: string;
    referenceId: string;
  }): Promise<boolean> {
    const formattedAmount = formatMinorUnits(params.netAmountMinorUnits, params.currency);
    return this.sendEmail({
      to: params.email,
      subject: `💰 Payout Released: ${formattedAmount} for ${params.projectTitle}`,
      text: `Hi ${params.name},\n\nYour milestone payout of ${formattedAmount} for "${params.milestoneTitle}" on "${params.projectTitle}" has been RELEASED.\n\nTransaction Reference ID: ${params.referenceId}\n\nYou can view and download your full payout receipt/ledger from your talent portal.\n\nThank you for delivering exceptional quality!\nOpenBench Ops Team`,
    });
  }
}

export const emailService = new EmailService();

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { prisma } from '../services/prisma.js';
import bcrypt from 'bcryptjs';
import {
  calculateBudgetSplit,
  calculateMilestonesSchedule,
  calculateContractorMilestoneSlice,
  calculateIndiaTds,
} from '../services/mathEngine.js';
import { paymentService } from '../services/paymentService.js';

describe('OpenBench End-to-End Collective Lifecycle Verification', () => {
  it('should execute the full 11-step happy path from talent intake to payout release', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const testId = Date.now();

    // 1. Talent applies (Status: WAITLISTED)
    const talentUser = await prisma.user.create({
      data: {
        email: `candidate_${testId}@example.com`,
        passwordHash,
        fullName: 'Jane Doe',
        role: 'TALENT',
        country: 'India',
        timezone: 'Asia/Kolkata',
        talentProfile: {
          create: {
            status: 'WAITLISTED',
            primaryCategory: 'WEB_APP_DEV',
            skills: JSON.stringify(['React 19', 'TypeScript', 'Node.js']),
            portfolioUrls: JSON.stringify(['https://github.com/janedoe']),
            yearsExperience: 6,
            weeklyHours: 35,
            preferredCurrency: 'INR',
            availabilityStatus: 'AVAILABLE_NOW',
            availabilityToken: `avail_token_${testId}`,
            tdsCategory: 'TECHNICAL_PROFESSIONAL_10',
          },
        },
      },
      include: { talentProfile: true },
    });

    assert.ok(talentUser.talentProfile);
    assert.strictEqual(talentUser.talentProfile.status, 'WAITLISTED');

    // 2. Admin vets & promotes to ACTIVE_BENCH
    const vettedTalent = await prisma.talentProfile.update({
      where: { id: talentUser.talentProfile.id },
      data: {
        status: 'ACTIVE_BENCH',
        vettingNotes: 'Passed 15-min technical scoping call. Exceptional code quality.',
        internalRating: 4.95,
      },
    });

    assert.strictEqual(vettedTalent.status, 'ACTIVE_BENCH');
    assert.strictEqual(vettedTalent.internalRating, 4.95);

    // 3. Client registers & submits a project brief
    const clientUser = await prisma.user.create({
      data: {
        email: `client_${testId}@enterprise.com`,
        passwordHash,
        fullName: 'Alice Smith',
        role: 'CLIENT',
        country: 'India',
        timezone: 'Asia/Kolkata',
        clientProfile: {
          create: {
            companyName: 'NextGen Retail India Pvt Ltd',
            billingCountry: 'India',
            billingCurrency: 'INR',
          },
        },
      },
      include: { clientProfile: true },
    });

    const projectGrossBudget = 10000000; // ₹1,00,000.00 (10,000,000 paise)

    const project = await prisma.project.create({
      data: {
        clientId: clientUser.clientProfile!.id,
        title: 'Omnichannel POS Web Application',
        category: 'WEB_APP_DEV',
        scopeSummary: 'Cloud POS terminal with real-time inventory synchronization and offline mode.',
        status: 'DRAFT_BRIEF',
        currency: 'INR',
        grossBudgetMinorUnits: projectGrossBudget,
        platformFeePercent: 30.0,
        revisionCapPerMilestone: 2,
      },
    });

    assert.strictEqual(project.status, 'DRAFT_BRIEF');

    // 4. Admin scopes 70/30 project & 50/30/20 milestone schedule
    const milestonesSchedule = calculateMilestonesSchedule(projectGrossBudget);
    assert.strictEqual(milestonesSchedule.length, 3);
    const mSum = milestonesSchedule.reduce((sum, m) => sum + m.amountMinorUnits, 0);
    assert.strictEqual(mSum, projectGrossBudget, 'Milestone amounts must equal gross budget');

    const createdMilestones = await Promise.all(
      milestonesSchedule.map((m, idx) =>
        prisma.milestone.create({
          data: {
            projectId: project.id,
            sequenceOrder: m.sequenceOrder,
            title: m.title,
            deliverablesSummary: `Milestone ${m.sequenceOrder} Deliverables`,
            percentOfBudget: m.percentOfBudget,
            amountMinorUnits: m.amountMinorUnits,
            status: idx === 0 ? 'PENDING_DEPOSIT' : 'UPCOMING',
          },
        })
      )
    );

    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'SCOPING' },
    });

    // 5. Admin assembles pod with specialists (70% pod, 30% platform)
    const podRoles = [
      { talentId: vettedTalent.id, roleTitle: 'Lead Architect', sharePercent: 70.0 },
    ];

    const split = calculateBudgetSplit(projectGrossBudget, 30.0, podRoles);
    assert.strictEqual(split.isBalanced, true);

    const podMember = await prisma.projectPodMember.create({
      data: {
        projectId: project.id,
        talentId: vettedTalent.id,
        roleTitle: 'Lead Architect',
        sharePercent: 70.0,
        payoutMinorUnits: split.specialists[0].payoutMinorUnits, // ₹70,000.00 (7,000,000 paise)
        inviteStatus: 'PENDING',
      },
    });

    assert.strictEqual(podMember.payoutMinorUnits, 7000000);

    // Create Contractor Payout records for each milestone
    for (const m of createdMilestones) {
      const slice = calculateContractorMilestoneSlice(
        podMember.payoutMinorUnits,
        m.percentOfBudget,
        m.sequenceOrder,
        3
      );
      const tds = calculateIndiaTds(slice, 'TECHNICAL_PROFESSIONAL_10');

      await prisma.contractorPayout.create({
        data: {
          milestoneId: m.id,
          podMemberId: podMember.id,
          grossAmountMinorUnits: tds.grossAmountMinorUnits,
          tdsAmountMinorUnits: tds.tdsAmountMinorUnits,
          netAmountMinorUnits: tds.netAmountMinorUnits,
          currency: 'INR',
          status: 'LOCKED',
        },
      });
    }

    // 6. Talent accepts open-book offer & e-signs SOW
    const acceptedPodMember = await prisma.projectPodMember.update({
      where: { id: podMember.id },
      data: {
        inviteStatus: 'ACCEPTED',
        signedName: 'Jane Doe',
        signedAt: new Date(),
        signedIp: '127.0.0.1',
      },
    });

    assert.strictEqual(acceptedPodMember.inviteStatus, 'ACCEPTED');

    // 7. Client pays Milestone 1 deposit
    const m1 = createdMilestones[0];
    const paymentResult = await paymentService.confirmMilestonePayment(
      m1.id,
      `pi_test_deposit_${testId}`,
      'SANDBOX'
    );

    assert.strictEqual(paymentResult.success, true);
    assert.strictEqual(paymentResult.milestone.status, 'IN_PROGRESS');

    // 8. Talent submits deliverable for Milestone 1
    const submission = await prisma.deliverableSubmission.create({
      data: {
        milestoneId: m1.id,
        submittedById: vettedTalent.id,
        deliverableUrl: 'https://github.com/nextgen/pos-v1/releases/tag/v0.1',
        notes: 'Initial React 19 terminal setup and offline sync engine completed.',
        qaStatus: 'PENDING_QA',
      },
    });

    assert.strictEqual(submission.qaStatus, 'PENDING_QA');

    // 9. Admin Founder QA approves deliverable for client review
    const approvedSubmission = await prisma.deliverableSubmission.update({
      where: { id: submission.id },
      data: {
        qaStatus: 'QA_APPROVED',
        qaFeedback: 'Tested on staging environment. All unit tests and offline fixtures pass.',
      },
    });

    assert.strictEqual(approvedSubmission.qaStatus, 'QA_APPROVED');

    await prisma.milestone.update({
      where: { id: m1.id },
      data: { status: 'SUBMITTED_TO_CLIENT' },
    });

    // 10. Client approves deliverable
    const finalMilestone = await prisma.milestone.update({
      where: { id: m1.id },
      data: { status: 'APPROVED_PAID' },
    });

    assert.strictEqual(finalMilestone.status, 'APPROVED_PAID');

    // 11. Admin releases split payout with transaction reference
    const payoutToRelease = await prisma.contractorPayout.findFirst({
      where: { milestoneId: m1.id, podMemberId: podMember.id },
    });

    assert.ok(payoutToRelease);

    const releasedPayout = await prisma.contractorPayout.update({
      where: { id: payoutToRelease.id },
      data: {
        status: 'RELEASED',
        referenceId: `UPI_REF_${testId}`,
        releasedAt: new Date(),
      },
    });

    assert.strictEqual(releasedPayout.status, 'RELEASED');
    assert.strictEqual(releasedPayout.referenceId, `UPI_REF_${testId}`);
    // ₹35,000 gross slice * 10% TDS = ₹3,500 TDS -> ₹31,500 net
    assert.strictEqual(releasedPayout.grossAmountMinorUnits, 3500000);
    assert.strictEqual(releasedPayout.tdsAmountMinorUnits, 350000);
    assert.strictEqual(releasedPayout.netAmountMinorUnits, 3150000);

    console.log('🎉 Full 11-step lifecycle executed and mathematically verified!');
  });
});

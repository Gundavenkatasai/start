import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting OpenBench Database Seed...');

  // Clear existing records
  await prisma.auditLog.deleteMany({});
  await prisma.processedWebhookEvent.deleteMany({});
  await prisma.contractorPayout.deleteMany({});
  await prisma.changeOrder.deleteMany({});
  await prisma.deliverableSubmission.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.projectPodMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.talentProfile.deleteMany({});
  await prisma.clientProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // 1. Two ADMIN Founder Accounts (2-Person Ops Team)
  const admin1 = await prisma.user.create({
    data: {
      email: 'alex@openbench.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Alex Morgan',
      role: 'ADMIN',
      country: 'United States',
      timezone: 'America/New_York',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'priya@openbench.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Priya Sharma',
      role: 'ADMIN',
      country: 'India',
      timezone: 'Asia/Kolkata',
    },
  });

  console.log('✅ Created 2 ADMIN Founder accounts: alex@openbench.io, priya@openbench.io');

  // 2. Six Realistic TALENT Accounts Across 4 Verticals & Regions
  // Talent 1: US - Web & App Dev (ACTIVE_BENCH)
  const talentUser1 = await prisma.user.create({
    data: {
      email: 'marcus.vance@gmail.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Marcus Vance',
      role: 'TALENT',
      country: 'United States',
      timezone: 'America/Los_Angeles',
      talentProfile: {
        create: {
          status: 'ACTIVE_BENCH',
          primaryCategory: 'WEB_APP_DEV',
          skills: JSON.stringify(['React 19', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL']),
          portfolioUrls: JSON.stringify(['https://github.com/marcusvance', 'https://marcusvance.dev']),
          yearsExperience: 8,
          weeklyHours: 40,
          preferredCurrency: 'USD',
          availabilityStatus: 'AVAILABLE_NOW',
          availabilityToken: 'token_marcus_72h',
          lastAvailabilityConfirmedAt: new Date(),
          internalRating: 4.9,
          vettingNotes: 'Exceptional full-stack architecture depth. Led frontend migration at Series B SaaS. 15-min call cleared with distinction.',
          payoutMethod: 'WISE',
          payoutDetails: JSON.stringify({ wiseEmail: 'marcus.vance@gmail.com', accountType: 'USD' }),
        },
      },
    },
    include: { talentProfile: true },
  });

  // Talent 2: UK - UI/UX Design (ON_PROJECT)
  const talentUser2 = await prisma.user.create({
    data: {
      email: 'elena.rostova@designpod.co.uk',
      passwordHash: defaultPasswordHash,
      fullName: 'Elena Rostova',
      role: 'TALENT',
      country: 'United Kingdom',
      timezone: 'Europe/London',
      talentProfile: {
        create: {
          status: 'ON_PROJECT',
          primaryCategory: 'UI_UX_DESIGN',
          skills: JSON.stringify(['Figma', 'Design Systems', 'Micro-Interactions', 'UX Research', 'Prototyping']),
          portfolioUrls: JSON.stringify(['https://dribbble.com/elenarostova', 'https://rostova.design']),
          yearsExperience: 6,
          weeklyHours: 35,
          preferredCurrency: 'GBP',
          availabilityStatus: 'LIMITED',
          availabilityToken: 'token_elena_2w',
          lastAvailabilityConfirmedAt: new Date(),
          internalRating: 5.0,
          vettingNotes: 'High-polish enterprise product designer. Outstanding Figma component libraries.',
          payoutMethod: 'IBAN',
          payoutDetails: JSON.stringify({ iban: 'GB29NWBK60161331926819', bic: 'NWBKGB2L' }),
        },
      },
    },
    include: { talentProfile: true },
  });

  // Talent 3: Germany - Web & App Dev (ACTIVE_BENCH)
  const talentUser3 = await prisma.user.create({
    data: {
      email: 'lukas.becker@berlincode.de',
      passwordHash: defaultPasswordHash,
      fullName: 'Lukas Becker',
      role: 'TALENT',
      country: 'Germany',
      timezone: 'Europe/Berlin',
      talentProfile: {
        create: {
          status: 'ACTIVE_BENCH',
          primaryCategory: 'WEB_APP_DEV',
          skills: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Docker', 'Go', 'Express']),
          portfolioUrls: JSON.stringify(['https://github.com/lukasbecker']),
          yearsExperience: 7,
          weeklyHours: 40,
          preferredCurrency: 'EUR',
          availabilityStatus: 'AVAILABLE_NOW',
          availabilityToken: 'token_lukas_now',
          lastAvailabilityConfirmedAt: new Date(),
          internalRating: 4.8,
          vettingNotes: 'Strong clean architecture. Expert in Docker containerization and performant SPAs.',
          payoutMethod: 'IBAN',
          payoutDetails: JSON.stringify({ iban: 'DE89370400440532013000', bic: 'DBEUTDDEXXX' }),
        },
      },
    },
    include: { talentProfile: true },
  });

  // Talent 4: India - Full Stack / Mobile (ON_PROJECT)
  const talentUser4 = await prisma.user.create({
    data: {
      email: 'arjun.mehta@devstack.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Arjun Mehta',
      role: 'TALENT',
      country: 'India',
      timezone: 'Asia/Kolkata',
      talentProfile: {
        create: {
          status: 'ON_PROJECT',
          primaryCategory: 'WEB_APP_DEV',
          skills: JSON.stringify(['React Native', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS']),
          portfolioUrls: JSON.stringify(['https://github.com/arjunmehta', 'https://arjunmehta.tech']),
          yearsExperience: 5,
          weeklyHours: 45,
          preferredCurrency: 'INR',
          availabilityStatus: 'LIMITED',
          availabilityToken: 'token_arjun_ping',
          lastAvailabilityConfirmedAt: new Date(),
          internalRating: 4.9,
          vettingNotes: 'High velocity and solid engineering rigor. Verified PAN/GSTIN and 194J TDS compliance.',
          payoutMethod: 'UPI',
          payoutDetails: JSON.stringify({ upiId: 'arjunmehta@oksbi', accountHolder: 'Arjun Mehta' }),
          panNumber: 'ABCDE1234F',
          gstin: '29ABCDE1234F1Z5',
          tdsCategory: 'TECHNICAL_PROFESSIONAL_10',
        },
      },
    },
    include: { talentProfile: true },
  });

  // Talent 5: India - Video Editing (VETTING)
  const talentUser5 = await prisma.user.create({
    data: {
      email: 'rohan.nair@motionstudios.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Rohan Nair',
      role: 'TALENT',
      country: 'India',
      timezone: 'Asia/Kolkata',
      talentProfile: {
        create: {
          status: 'VETTING',
          primaryCategory: 'VIDEO_EDITING',
          skills: JSON.stringify(['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design', 'Motion Graphics']),
          portfolioUrls: JSON.stringify(['https://vimeo.com/rohannair', 'https://behance.net/rohannair']),
          yearsExperience: 4,
          weeklyHours: 30,
          preferredCurrency: 'INR',
          availabilityStatus: 'AVAILABLE_NOW',
          availabilityToken: 'token_rohan_vet',
          lastAvailabilityConfirmedAt: new Date(),
          internalRating: 4.5,
          vettingNotes: 'High visual craft in SaaS product launch reels. 15-min technical review call scheduled.',
          payoutMethod: 'BANK_TRANSFER',
          payoutDetails: JSON.stringify({ bankName: 'HDFC Bank', accountNumber: '50100234918231', ifsc: 'HDFC0001234' }),
          panNumber: 'BNMOP9876Q',
          tdsCategory: 'CONTRACTUAL_1_OR_2',
        },
      },
    },
    include: { talentProfile: true },
  });

  // Talent 6: UK - Digital Marketing (WAITLISTED)
  const talentUser6 = await prisma.user.create({
    data: {
      email: 'sophie.taylor@growthlab.co.uk',
      passwordHash: defaultPasswordHash,
      fullName: 'Sophie Taylor',
      role: 'TALENT',
      country: 'United Kingdom',
      timezone: 'Europe/London',
      talentProfile: {
        create: {
          status: 'WAITLISTED',
          primaryCategory: 'DIGITAL_MARKETING',
          skills: JSON.stringify(['Growth Strategy', 'B2B SEO', 'Paid Ads', 'Email Sequencing', 'HubSpot']),
          portfolioUrls: JSON.stringify(['https://linkedin.com/in/sophietaylor-growth']),
          yearsExperience: 5,
          weeklyHours: 25,
          preferredCurrency: 'GBP',
          availabilityStatus: 'AVAILABLE_NOW',
          availabilityToken: 'token_sophie_wait',
          lastAvailabilityConfirmedAt: null,
          internalRating: null,
          vettingNotes: 'Intake form submitted. Portfolio shows 3x pipeline growth for London fintech.',
          payoutMethod: 'WISE',
          payoutDetails: JSON.stringify({ wiseEmail: 'sophie.taylor@growthlab.co.uk' }),
        },
      },
    },
    include: { talentProfile: true },
  });

  console.log('✅ Created 6 TALENT profiles across 4 verticals & statuses');

  // 3. Two CLIENT Accounts (US + India)
  // Client 1: US
  const clientUser1 = await prisma.user.create({
    data: {
      email: 'sarah.connor@apexscale.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Sarah Connor',
      role: 'CLIENT',
      country: 'United States',
      timezone: 'America/New_York',
      clientProfile: {
        create: {
          companyName: 'ApexScale Cloud Technologies Inc.',
          billingCountry: 'United States',
          billingCurrency: 'USD',
          taxId: 'US-EIN-98-7654321',
        },
      },
    },
    include: { clientProfile: true },
  });

  // Client 2: India
  const clientUser2 = await prisma.user.create({
    data: {
      email: 'vikram.singh@zenithflow.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Vikram Singh',
      role: 'CLIENT',
      country: 'India',
      timezone: 'Asia/Kolkata',
      clientProfile: {
        create: {
          companyName: 'ZenithFlow Payments Pvt Ltd',
          billingCountry: 'India',
          billingCurrency: 'INR',
          taxId: '27AABCT3529Q1Z8',
        },
      },
    },
    include: { clientProfile: true },
  });

  console.log('✅ Created 2 CLIENT profiles: ApexScale (US) & ZenithFlow (India)');

  // 4. Sample Project 1: IN_PROGRESS with Milestones, Pod Members, Deliverable & Payouts
  // Client: ApexScale, Gross Budget: $15,000 USD (1,500,000 cents)
  // 30% Platform: 450,000 cents (12% sales/ops = 180,000, 10% PM/QA = 150,000, 8% reserve = 120,000)
  // 70% Pod: 1,050,000 cents distributed:
  // - Marcus Vance: 45% = 675,000 cents
  // - Elena Rostova: 25% = 375,000 cents
  // Milestones:
  // - M1 (50% = 750,000 cents): PAID & IN_QA_REVIEW
  // - M2 (30% = 450,000 cents): UPCOMING
  // - M3 (20% = 300,000 cents): UPCOMING
  const project1 = await prisma.project.create({
    data: {
      clientId: clientUser1.clientProfile!.id,
      leadAdminId: admin1.id,
      title: 'Global Multi-Tenant Billing Portal',
      category: 'WEB_APP_DEV',
      scopeSummary:
        'End-to-end responsive client billing portal with multi-currency subscriptions, Stripe billing integration, enterprise role-based access, and audited audit logs.',
      status: 'IN_PROGRESS',
      currency: 'USD',
      grossBudgetMinorUnits: 1500000, // $15,000.00
      platformFeePercent: 30.0,
      revisionCapPerMilestone: 2,
      targetTimeline: '6 Weeks',
      referenceLinks: JSON.stringify(['https://apexscale.com/docs', 'https://figma.com/file/sample-billing']),
    },
  });

  // Pod Members for Project 1
  const podMember1 = await prisma.projectPodMember.create({
    data: {
      projectId: project1.id,
      talentId: talentUser1.talentProfile!.id,
      roleTitle: 'Principal Full-Stack Engineer',
      sharePercent: 45.0,
      payoutMinorUnits: 675000, // $6,750.00
      inviteStatus: 'ACCEPTED',
      signedName: 'Marcus Vance',
      signedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      signedIp: '198.51.100.42',
    },
  });

  const podMember2 = await prisma.projectPodMember.create({
    data: {
      projectId: project1.id,
      talentId: talentUser2.talentProfile!.id,
      roleTitle: 'Lead Product Designer',
      sharePercent: 25.0,
      payoutMinorUnits: 375000, // $3,750.00
      inviteStatus: 'ACCEPTED',
      signedName: 'Elena Rostova',
      signedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      signedIp: '82.165.197.1',
    },
  });

  // Milestones for Project 1
  const m1 = await prisma.milestone.create({
    data: {
      projectId: project1.id,
      sequenceOrder: 1,
      title: 'Architecture Blueprint & UI Design System Specs',
      deliverablesSummary:
        'Complete high-fidelity Figma components, API contract OpenAPI specs, and initial Docker scaffold.',
      percentOfBudget: 50.0,
      amountMinorUnits: 750000, // $7,500.00
      status: 'IN_QA_REVIEW',
      revisionsUsed: 0,
      paymentProvider: 'STRIPE',
      paymentIntentId: 'pi_sample_deposit_apexscale_01',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  const m2 = await prisma.milestone.create({
    data: {
      projectId: project1.id,
      sequenceOrder: 2,
      title: 'Full Portal Implementation & Stripe Integration',
      deliverablesSummary:
        'Working SPA frontend, authenticated backend routes, webhooks, and billing dashboard test runs.',
      percentOfBudget: 30.0,
      amountMinorUnits: 450000, // $4,500.00
      status: 'UPCOMING',
      revisionsUsed: 0,
    },
  });

  const m3 = await prisma.milestone.create({
    data: {
      projectId: project1.id,
      sequenceOrder: 3,
      title: 'Security Hardening, E2E Testing & Cloud Deployment',
      deliverablesSummary:
        'Full test suite pass, penetration scan verification, production deployment, and client handover.',
      percentOfBudget: 20.0,
      amountMinorUnits: 300000, // $3,000.00
      status: 'UPCOMING',
      revisionsUsed: 0,
    },
  });

  // Deliverable Submission for Milestone 1 by Marcus Vance
  await prisma.deliverableSubmission.create({
    data: {
      milestoneId: m1.id,
      submittedById: talentUser1.talentProfile!.id,
      deliverableUrl: 'https://github.com/apexscale/billing-portal-v1/releases/tag/v0.1-arch',
      notes:
        'Completed the architecture blueprint, OpenAPI spec, and UI token synchronization. Ready for Founder QA check before client presentation.',
      qaStatus: 'PENDING_QA',
      qaFeedback: null,
    },
  });

  // Contractor Payouts for M1 (marked CLIENT_PAID because client paid M1 deposit)
  // Marcus Vance M1 slice (50% of 675,000 = 337,500 cents)
  await prisma.contractorPayout.create({
    data: {
      milestoneId: m1.id,
      podMemberId: podMember1.id,
      grossAmountMinorUnits: 337500,
      tdsAmountMinorUnits: 0, // US resident, no India TDS
      netAmountMinorUnits: 337500,
      currency: 'USD',
      status: 'CLIENT_PAID', // Waiting for QA approval before founder clicks RELEASE
    },
  });

  // Elena Rostova M1 slice (50% of 375,000 = 187,500 cents)
  await prisma.contractorPayout.create({
    data: {
      milestoneId: m1.id,
      podMemberId: podMember2.id,
      grossAmountMinorUnits: 187500,
      tdsAmountMinorUnits: 0, // UK resident
      netAmountMinorUnits: 187500,
      currency: 'USD',
      status: 'CLIENT_PAID',
    },
  });

  // Contractor Payouts for M2 & M3 (LOCKED)
  await prisma.contractorPayout.create({
    data: {
      milestoneId: m2.id,
      podMemberId: podMember1.id,
      grossAmountMinorUnits: 202500,
      tdsAmountMinorUnits: 0,
      netAmountMinorUnits: 202500,
      currency: 'USD',
      status: 'LOCKED',
    },
  });
  await prisma.contractorPayout.create({
    data: {
      milestoneId: m2.id,
      podMemberId: podMember2.id,
      grossAmountMinorUnits: 112500,
      tdsAmountMinorUnits: 0,
      netAmountMinorUnits: 112500,
      currency: 'USD',
      status: 'LOCKED',
    },
  });

  await prisma.contractorPayout.create({
    data: {
      milestoneId: m3.id,
      podMemberId: podMember1.id,
      grossAmountMinorUnits: 135000,
      tdsAmountMinorUnits: 0,
      netAmountMinorUnits: 135000,
      currency: 'USD',
      status: 'LOCKED',
    },
  });
  await prisma.contractorPayout.create({
    data: {
      milestoneId: m3.id,
      podMemberId: podMember2.id,
      grossAmountMinorUnits: 75000,
      tdsAmountMinorUnits: 0,
      netAmountMinorUnits: 75000,
      currency: 'USD',
      status: 'LOCKED',
    },
  });

  console.log('✅ Created Project 1: "Global Multi-Tenant Billing Portal" (IN_PROGRESS with M1 paid)');

  // 5. Sample Project 2: DRAFT_BRIEF Ready for Founder Scoping
  // Client: ZenithFlow (India), Target Budget: ₹8,00,000 INR (80,000,000 paise)
  await prisma.project.create({
    data: {
      clientId: clientUser2.clientProfile!.id,
      leadAdminId: admin2.id,
      title: 'Mobile Banking SuperApp Redesign & SDK',
      category: 'UI_UX_DESIGN',
      scopeSummary:
        'Complete design audit and ground-up React Native UI/UX system for our next-generation merchant QR and settlement mobile app across iOS and Android.',
      status: 'DRAFT_BRIEF',
      currency: 'INR',
      grossBudgetMinorUnits: 80000000, // ₹8,00,000.00 (80,000,000 paise)
      platformFeePercent: 30.0,
      revisionCapPerMilestone: 2,
      targetTimeline: '4-5 Weeks',
      referenceLinks: JSON.stringify(['https://zenithflow.in/app-preview']),
    },
  });

  console.log('✅ Created Project 2: "Mobile Banking SuperApp Redesign & SDK" (DRAFT_BRIEF ready to scope)');
  console.log('🎉 OpenBench Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

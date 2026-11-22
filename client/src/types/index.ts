export type UserRole = 'ADMIN' | 'TALENT' | 'CLIENT';

export type BenchStatus = 'WAITLISTED' | 'VETTING' | 'ACTIVE_BENCH' | 'ON_PROJECT' | 'ARCHIVED';

export type AvailabilityStatus = 'AVAILABLE_NOW' | 'LIMITED' | 'UNAVAILABLE';

export type SkillCategory = 'WEB_APP_DEV' | 'UI_UX_DESIGN' | 'VIDEO_EDITING' | 'DIGITAL_MARKETING';

export type Currency = 'USD' | 'GBP' | 'EUR' | 'INR';

export type ProjectStatus =
  | 'DRAFT_BRIEF'
  | 'SCOPING'
  | 'POD_INVITES_SENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type MilestoneStatus =
  | 'UPCOMING'
  | 'PENDING_DEPOSIT'
  | 'IN_PROGRESS'
  | 'IN_QA_REVIEW'
  | 'SUBMITTED_TO_CLIENT'
  | 'REVISION_REQUESTED'
  | 'APPROVED_PAID';

export type QAStatus = 'PENDING_QA' | 'QA_APPROVED' | 'QA_CHANGES_REQUESTED';

export type PayoutStatus = 'LOCKED' | 'CLIENT_PAID' | 'RELEASED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  country: string;
  timezone: string;
  talentProfile?: TalentProfile | null;
  clientProfile?: ClientProfile | null;
}

export interface TalentProfile {
  id: string;
  userId: string;
  user?: User;
  status: BenchStatus;
  primaryCategory: SkillCategory;
  skills: string[];
  portfolioUrls: string[];
  yearsExperience: number;
  weeklyHours: number;
  preferredCurrency: Currency;
  availabilityStatus: AvailabilityStatus;
  lastAvailabilityConfirmedAt: string | null;
  availabilityToken?: string | null;
  internalRating?: number | null;
  vettingNotes?: string | null;
  payoutMethod?: string | null;
  payoutDetails?: any;
  panNumber?: string | null;
  gstin?: string | null;
  tdsCategory: string;
  podMemberships?: ProjectPodMember[];
}

export interface ClientProfile {
  id: string;
  userId: string;
  user?: User;
  companyName: string;
  billingCurrency: Currency;
  billingCountry: string;
  taxId?: string | null;
  projects?: Project[];
}

export interface ProjectPodMember {
  id: string;
  projectId: string;
  project?: Project;
  talentId: string;
  talent?: TalentProfile;
  roleTitle: string;
  sharePercent: number;
  payoutMinorUnits: number;
  inviteStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  signedName?: string | null;
  signedAt?: string | null;
  signedIp?: string | null;
  declineReason?: string | null;
  payouts?: ContractorPayout[];
}

export interface Milestone {
  id: string;
  projectId: string;
  sequenceOrder: number;
  title: string;
  deliverablesSummary: string;
  percentOfBudget: number;
  amountMinorUnits: number;
  dueDate?: string | null;
  status: MilestoneStatus;
  revisionsUsed: number;
  paymentProvider?: string | null;
  paymentIntentId?: string | null;
  paidAt?: string | null;
  deliverableSubmissions?: DeliverableSubmission[];
  payouts?: ContractorPayout[];
}

export interface DeliverableSubmission {
  id: string;
  milestoneId: string;
  submittedById: string;
  submittedBy?: TalentProfile;
  deliverableUrl: string;
  notes?: string | null;
  qaStatus: QAStatus;
  qaFeedback?: string | null;
  clientFeedback?: string | null;
  createdAt: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  additionalAmountMinorUnits: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ContractorPayout {
  id: string;
  milestoneId: string;
  milestone?: Milestone;
  podMemberId: string;
  podMember?: ProjectPodMember;
  grossAmountMinorUnits: number;
  tdsAmountMinorUnits: number;
  netAmountMinorUnits: number;
  currency: Currency;
  status: PayoutStatus;
  referenceId?: string | null;
  releasedAt?: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  client?: ClientProfile;
  leadAdminId?: string | null;
  leadAdmin?: User | null;
  title: string;
  category: SkillCategory;
  scopeSummary: string;
  status: ProjectStatus;
  currency: Currency;
  grossBudgetMinorUnits: number;
  platformFeePercent: number;
  revisionCapPerMilestone: number;
  targetTimeline?: string | null;
  referenceLinks?: string | null;
  podMembers?: ProjectPodMember[];
  milestones?: Milestone[];
  changeOrders?: ChangeOrder[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSplitData {
  grossBudgetMinorUnits: number;
  platform: {
    totalPlatformPercent: number;
    totalPlatformMinorUnits: number;
    salesAndOpsPercent: number;
    salesAndOpsMinorUnits: number;
    pmAndQaPercent: number;
    pmAndQaMinorUnits: number;
    reserveMarginPercent: number;
    reserveMarginMinorUnits: number;
  };
  podExecutionPercent: number;
  podExecutionMinorUnits: number;
  specialists: {
    talentId: string;
    roleTitle: string;
    sharePercent: number;
    payoutMinorUnits: number;
  }[];
  totalAllocatedMinorUnits: number;
  isBalanced: boolean;
}

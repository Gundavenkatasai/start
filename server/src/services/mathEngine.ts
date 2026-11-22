/**
 * OpenBench Zero Floating-Point Money Math Engine
 * All financial amounts are processed in integer minor units (cents / paise)
 * with deterministic remainder distribution (Hare-Niemeyer / Largest Remainder Method).
 */

export interface RoleShareInput {
  talentId: string;
  roleTitle: string;
  sharePercent: number; // e.g. 40.0 for 40%
}

export interface CalculatedRolePayout {
  talentId: string;
  roleTitle: string;
  sharePercent: number;
  payoutMinorUnits: number;
}

export interface PlatformSplitBreakdown {
  totalPlatformPercent: number;
  totalPlatformMinorUnits: number;
  salesAndOpsPercent: number;
  salesAndOpsMinorUnits: number;
  pmAndQaPercent: number;
  pmAndQaMinorUnits: number;
  reserveMarginPercent: number;
  reserveMarginMinorUnits: number;
}

export interface FullProjectSplitResult {
  grossBudgetMinorUnits: number;
  platform: PlatformSplitBreakdown;
  podExecutionPercent: number;
  podExecutionMinorUnits: number;
  specialists: CalculatedRolePayout[];
  totalAllocatedMinorUnits: number;
  isBalanced: boolean;
}

export interface MilestoneSplitSchedule {
  sequenceOrder: number;
  title: string;
  percentOfBudget: number;
  amountMinorUnits: number;
}

export interface IndiaTdsResult {
  grossAmountMinorUnits: number;
  tdsPercent: number;
  tdsAmountMinorUnits: number;
  netAmountMinorUnits: number;
  tdsCategory: string;
}

/**
 * Distribute a total integer amount among multiple percentage shares
 * using the Largest Remainder Method (Hare-Niemeyer).
 * Guarantees that the sum of allocated parts strictly equals the total integer amount.
 */
export function distributeIntegerByShares(
  totalMinorUnits: number,
  shares: { id: string; percent: number }[]
): { id: string; percent: number; allocatedMinorUnits: number }[] {
  if (shares.length === 0) return [];
  if (totalMinorUnits <= 0) {
    return shares.map((s) => ({ ...s, allocatedMinorUnits: 0 }));
  }

  const totalSharePercent = shares.reduce((acc, s) => acc + s.percent, 0);
  
  // Calculate raw theoretical shares and integer floors
  const allocations = shares.map((share, index) => {
    // Normalization factor against the provided share set
    const exact = (totalMinorUnits * share.percent) / totalSharePercent;
    const floored = Math.floor(exact);
    const remainder = exact - floored;
    return {
      index,
      id: share.id,
      percent: share.percent,
      floored,
      remainder,
    };
  });

  const sumFloored = allocations.reduce((acc, a) => acc + a.floored, 0);
  let remainderMinorUnits = totalMinorUnits - sumFloored;

  // Sort descending by remainder to allocate leftover minor units
  const sorted = [...allocations].sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < sorted.length && remainderMinorUnits > 0; i++) {
    sorted[i].floored += 1;
    remainderMinorUnits -= 1;
  }

  // Restore original ordering
  sorted.sort((a, b) => a.index - b.index);

  return sorted.map((s) => ({
    id: s.id,
    percent: s.percent,
    allocatedMinorUnits: s.floored,
  }));
}

/**
 * Calculate the full open-book project budget split
 * Default: 30% platform margin (12% sales/ops, 10% PM/QA, 8% reserve)
 * 70% execution pod distributed among specialist roles.
 */
export function calculateBudgetSplit(
  grossBudgetMinorUnits: number,
  platformFeePercent: number = 30.0,
  specialistRoles: RoleShareInput[] = []
): FullProjectSplitResult {
  // Validate total percentage
  const specialistTotalPercent = specialistRoles.reduce((sum, r) => sum + r.sharePercent, 0);
  const totalPercent = Math.round((platformFeePercent + specialistTotalPercent) * 100) / 100;
  const isBalanced = Math.abs(totalPercent - 100) < 0.001;

  // Split gross budget between platform and pod
  const topLevel = distributeIntegerByShares(grossBudgetMinorUnits, [
    { id: 'PLATFORM', percent: platformFeePercent },
    { id: 'POD', percent: specialistTotalPercent },
  ]);

  const platformMinorUnits = topLevel.find((t) => t.id === 'PLATFORM')?.allocatedMinorUnits || 0;
  const podMinorUnits = topLevel.find((t) => t.id === 'POD')?.allocatedMinorUnits || 0;

  // Itemized breakdown of platform share: 12% sales/ops, 10% PM/QA, 8% reserve out of 30% (or proportional)
  const defaultSalesPercent = (platformFeePercent * 12) / 30;
  const defaultPmQaPercent = (platformFeePercent * 10) / 30;
  const defaultReservePercent = (platformFeePercent * 8) / 30;

  const platformSubsplits = distributeIntegerByShares(platformMinorUnits, [
    { id: 'SALES_OPS', percent: defaultSalesPercent },
    { id: 'PM_QA', percent: defaultPmQaPercent },
    { id: 'RESERVE', percent: defaultReservePercent },
  ]);

  const salesAndOpsMinorUnits =
    platformSubsplits.find((s) => s.id === 'SALES_OPS')?.allocatedMinorUnits || 0;
  const pmAndQaMinorUnits = platformSubsplits.find((s) => s.id === 'PM_QA')?.allocatedMinorUnits || 0;
  const reserveMarginMinorUnits =
    platformSubsplits.find((s) => s.id === 'RESERVE')?.allocatedMinorUnits || 0;

  // Distribute the pod execution pool among specialists
  const specialistShares = specialistRoles.map((r) => ({
    id: r.talentId,
    percent: r.sharePercent,
  }));

  const podAllocations = distributeIntegerByShares(podMinorUnits, specialistShares);

  const specialists: CalculatedRolePayout[] = specialistRoles.map((role) => {
    const alloc = podAllocations.find((p) => p.id === role.talentId);
    return {
      talentId: role.talentId,
      roleTitle: role.roleTitle,
      sharePercent: role.sharePercent,
      payoutMinorUnits: alloc ? alloc.allocatedMinorUnits : 0,
    };
  });

  const totalAllocated =
    platformMinorUnits + specialists.reduce((acc, s) => acc + s.payoutMinorUnits, 0);

  return {
    grossBudgetMinorUnits,
    platform: {
      totalPlatformPercent: platformFeePercent,
      totalPlatformMinorUnits: platformMinorUnits,
      salesAndOpsPercent: Math.round(defaultSalesPercent * 100) / 100,
      salesAndOpsMinorUnits,
      pmAndQaPercent: Math.round(defaultPmQaPercent * 100) / 100,
      pmAndQaMinorUnits,
      reserveMarginPercent: Math.round(defaultReservePercent * 100) / 100,
      reserveMarginMinorUnits,
    },
    podExecutionPercent: specialistTotalPercent,
    podExecutionMinorUnits: podMinorUnits,
    specialists,
    totalAllocatedMinorUnits: totalAllocated,
    isBalanced,
  };
}

/**
 * Calculate standard milestone schedule (Default: 50% upfront, 30% mid-delivery, 20% final sign-off)
 */
export function calculateMilestonesSchedule(
  grossBudgetMinorUnits: number,
  splits: { sequenceOrder: number; title: string; percent: number }[] = [
    { sequenceOrder: 1, title: 'Deposit & Architecture / Initial Sprint', percent: 50.0 },
    { sequenceOrder: 2, title: 'Core Implementation & Deliverable Review', percent: 30.0 },
    { sequenceOrder: 3, title: 'Final Handover, QA Sign-off & Source Transfer', percent: 20.0 },
  ]
): MilestoneSplitSchedule[] {
  const shares = splits.map((s) => ({ id: s.sequenceOrder.toString(), percent: s.percent }));
  const distributed = distributeIntegerByShares(grossBudgetMinorUnits, shares);

  return splits.map((s) => {
    const found = distributed.find((d) => d.id === s.sequenceOrder.toString());
    return {
      sequenceOrder: s.sequenceOrder,
      title: s.title,
      percentOfBudget: s.percent,
      amountMinorUnits: found ? found.allocatedMinorUnits : 0,
    };
  });
}

/**
 * Calculate a contractor's milestone payout slice based on their total project role payout
 * and milestone percentage (e.g. 50%, 30%, 20%).
 */
export function calculateContractorMilestoneSlice(
  contractorTotalPayoutMinorUnits: number,
  milestonePercentOfBudget: number,
  sequenceOrder: number,
  totalMilestones: number = 3
): number {
  // If 3 standard milestones (50, 30, 20):
  // Milestone 1 (50%): floor(half)
  // Milestone 2 (30%): floor(30%)
  // Milestone 3 (20%): remainder so sum exactly matches contractorTotalPayoutMinorUnits
  if (sequenceOrder === totalMilestones) {
    // Return remainder
    const prior50 = Math.floor((contractorTotalPayoutMinorUnits * 50) / 100);
    const prior30 = Math.floor((contractorTotalPayoutMinorUnits * 30) / 100);
    return contractorTotalPayoutMinorUnits - (prior50 + prior30);
  }

  return Math.floor((contractorTotalPayoutMinorUnits * milestonePercentOfBudget) / 100);
}

/**
 * Calculate India Tax Deducted at Source (TDS) preview
 * Section 194J: 10% (Technical / Professional services)
 * Section 194C: 1% (Contractual work for individuals) or 2% (companies)
 */
export function calculateIndiaTds(
  grossAmountMinorUnits: number,
  tdsCategory: string = 'TECHNICAL_PROFESSIONAL_10'
): IndiaTdsResult {
  let tdsPercent = 0;

  if (tdsCategory === 'TECHNICAL_PROFESSIONAL_10') {
    tdsPercent = 10.0;
  } else if (tdsCategory === 'CONTRACTUAL_1_OR_2') {
    tdsPercent = 1.0;
  } else {
    tdsPercent = 0.0;
  }

  const tdsAmountMinorUnits = Math.round((grossAmountMinorUnits * tdsPercent) / 100);
  const netAmountMinorUnits = grossAmountMinorUnits - tdsAmountMinorUnits;

  return {
    grossAmountMinorUnits,
    tdsPercent,
    tdsAmountMinorUnits,
    netAmountMinorUnits,
    tdsCategory,
  };
}

/**
 * Currency Formatter for UI & Reports
 * Formats minor units (cents/paise) into localized display strings
 */
export function formatMinorUnits(minorUnits: number, currency: string = 'USD'): string {
  const majorUnits = minorUnits / 100;
  const curr = currency.toUpperCase();

  try {
    const localeMap: Record<string, string> = {
      USD: 'en-US',
      GBP: 'en-GB',
      EUR: 'de-DE',
      INR: 'en-IN',
    };
    const locale = localeMap[curr] || 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(majorUnits);
  } catch {
    const symbolMap: Record<string, string> = {
      USD: '$',
      GBP: '£',
      EUR: '€',
      INR: '₹',
    };
    const symbol = symbolMap[curr] || '$';
    return `${symbol}${majorUnits.toFixed(2)}`;
  }
}

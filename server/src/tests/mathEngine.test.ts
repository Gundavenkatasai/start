import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  distributeIntegerByShares,
  calculateBudgetSplit,
  calculateMilestonesSchedule,
  calculateContractorMilestoneSlice,
  calculateIndiaTds,
  formatMinorUnits,
} from '../services/mathEngine.js';

describe('OpenBench Math Engine Tests', () => {
  it('should split $10,000 project budget cleanly with 30% platform margin and 70% pod', () => {
    const grossBudgetMinorUnits = 1000000; // $10,000.00
    const roles = [
      { talentId: 'talent-1', roleTitle: 'Lead Full-Stack Architect', sharePercent: 45.0 },
      { talentId: 'talent-2', roleTitle: 'Senior UI/UX Designer', sharePercent: 25.0 },
    ];

    const result = calculateBudgetSplit(grossBudgetMinorUnits, 30.0, roles);

    assert.strictEqual(result.isBalanced, true);
    assert.strictEqual(result.totalAllocatedMinorUnits, grossBudgetMinorUnits);
    assert.strictEqual(result.platform.totalPlatformMinorUnits, 300000); // $3,000.00
    assert.strictEqual(result.platform.salesAndOpsMinorUnits, 120000); // 12% = $1,200.00
    assert.strictEqual(result.platform.pmAndQaMinorUnits, 100000); // 10% = $1,000.00
    assert.strictEqual(result.platform.reserveMarginMinorUnits, 80000); // 8% = $800.00

    const leadDev = result.specialists.find((s) => s.talentId === 'talent-1');
    const designer = result.specialists.find((s) => s.talentId === 'talent-2');

    assert.ok(leadDev);
    assert.ok(designer);
    assert.strictEqual(leadDev?.payoutMinorUnits, 450000); // $4,500.00
    assert.strictEqual(designer?.payoutMinorUnits, 250000); // $2,500.00
    assert.strictEqual(
      result.platform.totalPlatformMinorUnits + leadDev!.payoutMinorUnits + designer!.payoutMinorUnits,
      grossBudgetMinorUnits
    );
  });

  it('should handle uneven odd amounts with zero cent leakage using Largest Remainder', () => {
    // $10,000.01 = 1000001 minor units divided among 3 roles with 33.33% each
    const totalMinorUnits = 1000001;
    const shares = [
      { id: 'A', percent: 33.333 },
      { id: 'B', percent: 33.333 },
      { id: 'C', percent: 33.334 },
    ];

    const result = distributeIntegerByShares(totalMinorUnits, shares);
    const sumAllocated = result.reduce((acc, r) => acc + r.allocatedMinorUnits, 0);

    assert.strictEqual(sumAllocated, totalMinorUnits, 'Allocated total must exactly equal totalMinorUnits');
  });

  it('should calculate standard 50/30/20 milestone schedule with zero leakage', () => {
    const grossBudgetMinorUnits = 750055; // $7,500.55
    const milestones = calculateMilestonesSchedule(grossBudgetMinorUnits);

    assert.strictEqual(milestones.length, 3);
    const totalMilestoneSum = milestones.reduce((sum, m) => sum + m.amountMinorUnits, 0);
    assert.strictEqual(totalMilestoneSum, grossBudgetMinorUnits);
  });

  it('should calculate contractor milestone slices matching total payout', () => {
    const contractorTotal = 450000; // $4,500.00
    const m1 = calculateContractorMilestoneSlice(contractorTotal, 50.0, 1, 3);
    const m2 = calculateContractorMilestoneSlice(contractorTotal, 30.0, 2, 3);
    const m3 = calculateContractorMilestoneSlice(contractorTotal, 20.0, 3, 3);

    assert.strictEqual(m1, 225000);
    assert.strictEqual(m2, 135000);
    assert.strictEqual(m3, 90000);
    assert.strictEqual(m1 + m2 + m3, contractorTotal);
  });

  it('should correctly calculate India TDS Section 194J (10%) and 194C (1%)', () => {
    const inrGrossPaise = 25000000; // ₹2,50,000.00

    // Section 194J - 10%
    const tds10 = calculateIndiaTds(inrGrossPaise, 'TECHNICAL_PROFESSIONAL_10');
    assert.strictEqual(tds10.tdsPercent, 10.0);
    assert.strictEqual(tds10.tdsAmountMinorUnits, 2500000); // ₹25,000.00
    assert.strictEqual(tds10.netAmountMinorUnits, 22500000); // ₹2,25,000.00

    // Section 194C - 1%
    const tds1 = calculateIndiaTds(inrGrossPaise, 'CONTRACTUAL_1_OR_2');
    assert.strictEqual(tds1.tdsPercent, 1.0);
    assert.strictEqual(tds1.tdsAmountMinorUnits, 250000); // ₹2,500.00
    assert.strictEqual(tds1.netAmountMinorUnits, 24750000); // ₹2,47,500.00
  });

  it('should format minor units cleanly across currencies', () => {
    const usdFormatted = formatMinorUnits(150000, 'USD');
    assert.ok(usdFormatted.includes('1,500.00') || usdFormatted.includes('$1,500.00'));

    const inrFormatted = formatMinorUnits(50000000, 'INR');
    assert.ok(inrFormatted.includes('5,00,000.00') || inrFormatted.includes('500,000.00') || inrFormatted.includes('₹'));
  });
});

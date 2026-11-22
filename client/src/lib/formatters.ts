import { Currency, BenchStatus, ProjectStatus, MilestoneStatus } from '../types';

export function formatCurrency(minorUnits: number, currency: Currency = 'USD'): string {
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(majorUnits);
  } catch {
    const symbolMap: Record<string, string> = {
      USD: '$',
      GBP: '£',
      EUR: '€',
      INR: '₹',
    };
    return `${symbolMap[curr] || '$'}${majorUnits.toLocaleString()}`;
  }
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getBenchStatusLabel(status: BenchStatus): { label: string; color: string } {
  switch (status) {
    case 'WAITLISTED':
      return { label: 'Waitlisted', color: 'bg-surface-secondary text-ink-secondary border-surface-border' };
    case 'VETTING':
      return { label: 'Vetting Call', color: 'bg-accent-amber-light text-amber-800 border-amber-200' };
    case 'ACTIVE_BENCH':
      return { label: 'Active Bench', color: 'bg-accent-emerald-light text-emerald-800 border-emerald-200' };
    case 'ON_PROJECT':
      return { label: 'On Project', color: 'bg-blue-50 text-accent-cobalt border-blue-200' };
    case 'ARCHIVED':
      return { label: 'Archived', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

export function getProjectStatusLabel(status: ProjectStatus): { label: string; color: string } {
  switch (status) {
    case 'DRAFT_BRIEF':
      return { label: 'Draft Brief', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'SCOPING':
      return { label: 'Scoping & Pod Selection', color: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'POD_INVITES_SENT':
      return { label: 'Pod Invites Sent', color: 'bg-blue-50 text-accent-cobalt border-blue-200' };
    case 'IN_PROGRESS':
      return { label: 'Active Delivery', color: 'bg-emerald-50 text-accent-emerald border-emerald-200' };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

export function getMilestoneStatusLabel(status: MilestoneStatus): { label: string; color: string } {
  switch (status) {
    case 'UPCOMING':
      return { label: 'Upcoming', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    case 'PENDING_DEPOSIT':
      return { label: 'Deposit Required', color: 'bg-amber-50 text-amber-800 border-amber-300' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'bg-blue-50 text-accent-cobalt border-blue-200' };
    case 'IN_QA_REVIEW':
      return { label: 'Founder QA Review', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'SUBMITTED_TO_CLIENT':
      return { label: 'Client Review', color: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'REVISION_REQUESTED':
      return { label: 'Revision Requested', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'APPROVED_PAID':
      return { label: 'Approved & Signed-Off', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'WEB_APP_DEV':
      return 'Web & App Development';
    case 'UI_UX_DESIGN':
      return 'UI/UX Design';
    case 'VIDEO_EDITING':
      return 'Video Editing';
    case 'DIGITAL_MARKETING':
      return 'Digital Marketing';
    default:
      return category;
  }
}

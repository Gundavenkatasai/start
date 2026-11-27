import React from 'react';
import { BenchStatus, ProjectStatus, MilestoneStatus } from '../../types';
import {
  getBenchStatusLabel,
  getProjectStatusLabel,
  getMilestoneStatusLabel,
} from '../../lib/formatters';

export const BenchStatusBadge: React.FC<{ status: BenchStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { label } = getBenchStatusLabel(status);

  // Smooth light pastel badge styles matching BenchStatus
  const styles: Record<BenchStatus, { bg: string; dot: string }> = {
    WAITLISTED: {
      bg: 'bg-surface-secondary text-ink-secondary border-surface-border',
      dot: 'bg-ink-muted',
    },
    VETTING: {
      bg: 'bg-accent-amber-light text-amber-700 border-accent-amber-border',
      dot: 'bg-amber-500',
    },
    ACTIVE_BENCH: {
      bg: 'bg-accent-emerald-light text-emerald-700 border-accent-emerald-border',
      dot: 'bg-emerald-500 animate-pulse',
    },
    ON_PROJECT: {
      bg: 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border',
      dot: 'bg-accent-cobalt',
    },
    ARCHIVED: {
      bg: 'bg-surface-secondary text-ink-muted border-surface-border',
      dot: 'bg-ink-muted',
    },
  };

  const current = styles[status] || styles.WAITLISTED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-colors ${current.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      {label}
    </span>
  );
};

export const ProjectStatusBadge: React.FC<{ status: ProjectStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { label } = getProjectStatusLabel(status);

  const styles: Record<ProjectStatus, { bg: string; dot: string }> = {
    DRAFT_BRIEF: {
      bg: 'bg-surface-secondary text-ink-secondary border-surface-border',
      dot: 'bg-ink-muted',
    },
    SCOPING: {
      bg: 'bg-accent-purple-light text-accent-purple border-accent-purple-border',
      dot: 'bg-purple-500',
    },
    POD_INVITES_SENT: {
      bg: 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border',
      dot: 'bg-accent-cobalt',
    },
    IN_PROGRESS: {
      bg: 'bg-accent-emerald-light text-emerald-700 border-accent-emerald-border',
      dot: 'bg-emerald-500 animate-pulse',
    },
    COMPLETED: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
    },
    CANCELLED: {
      bg: 'bg-accent-rose-light text-rose-700 border-accent-rose-border',
      dot: 'bg-rose-500',
    },
  };

  const current = styles[status] || styles.DRAFT_BRIEF;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-colors ${current.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      {label}
    </span>
  );
};

export const MilestoneStatusBadge: React.FC<{ status: MilestoneStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { label } = getMilestoneStatusLabel(status);

  const styles: Record<MilestoneStatus, string> = {
    UPCOMING: 'bg-surface-secondary text-ink-muted border-surface-border',
    PENDING_DEPOSIT: 'bg-accent-amber-light text-amber-700 border-accent-amber-border',
    IN_PROGRESS: 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border',
    IN_QA_REVIEW: 'bg-accent-purple-light text-accent-purple border-accent-purple-border',
    SUBMITTED_TO_CLIENT: 'bg-blue-50 text-indigo-700 border-indigo-200',
    REVISION_REQUESTED: 'bg-accent-rose-light text-rose-700 border-accent-rose-border',
    APPROVED_PAID: 'bg-accent-emerald-light text-emerald-700 border-accent-emerald-border',
  };

  const badgeStyle = styles[status] || 'bg-surface-secondary text-ink-secondary border-surface-border';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-colors ${badgeStyle} ${className}`}
    >
      {label}
    </span>
  );
};

export const PayoutStatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className = '',
}) => {
  let color = 'bg-surface-secondary text-ink-secondary border-surface-border';
  let label = status;

  if (status === 'LOCKED') {
    color = 'bg-accent-amber-light text-amber-700 border-accent-amber-border';
    label = 'Locked in Escrow';
  } else if (status === 'CLIENT_PAID') {
    color = 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border';
    label = 'Client Paid (QA Sign-off)';
  } else if (status === 'RELEASED') {
    color = 'bg-accent-emerald-light text-emerald-700 border-accent-emerald-border';
    label = 'Released to Bank/UPI';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-colors ${color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-80" />
      {label}
    </span>
  );
};

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
  const { label, color } = getBenchStatusLabel(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {label}
    </span>
  );
};

export const ProjectStatusBadge: React.FC<{ status: ProjectStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { label, color } = getProjectStatusLabel(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {label}
    </span>
  );
};

export const MilestoneStatusBadge: React.FC<{ status: MilestoneStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const { label, color } = getMilestoneStatusLabel(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${color} ${className}`}
    >
      {label}
    </span>
  );
};

export const PayoutStatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className = '',
}) => {
  let color = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status;

  if (status === 'LOCKED') {
    color = 'bg-amber-50 text-amber-800 border-amber-200';
    label = 'Locked in Escrow';
  } else if (status === 'CLIENT_PAID') {
    color = 'bg-blue-50 text-accent-cobalt border-blue-200';
    label = 'Client Paid (QA Sign-off)';
  } else if (status === 'RELEASED') {
    color = 'bg-accent-emerald-light text-emerald-800 border-emerald-200';
    label = 'Released to Bank/UPI';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${color} ${className}`}
    >
      {label}
    </span>
  );
};

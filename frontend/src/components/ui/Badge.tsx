import React from 'react';
import { cn } from '../../lib/utils';

const TONE_MAP: Record<string, string> = {
  // green
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Discharged: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  // blue
  Scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Outpatient: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Reserved: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  // amber
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'On Leave': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Cleaning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Admitted: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  // red
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  Overdue: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  Occupied: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  Inactive: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  'No Show': 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  'Off Duty': 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  // purple
  'In Surgery': 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
};

export function Badge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        TONE_MAP[value] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300'
      )}
    >
      {value}
    </span>
  );
}

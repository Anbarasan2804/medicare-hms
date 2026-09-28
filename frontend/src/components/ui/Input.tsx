import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
        className
      )}
      rows={3}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm text-[rgb(var(--text))] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-2xl max-h-[90vh] overflow-y-auto',
          widths[size]
        )}
      >
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] p-4 sticky top-0 bg-[rgb(var(--card))]">
          <h2 className="text-base font-semibold text-[rgb(var(--text))]">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border))]/50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-2xl">
        <h2 className="text-base font-semibold text-[rgb(var(--text))]">{title}</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-[rgb(var(--border))] px-4 text-sm text-[rgb(var(--text))] hover:bg-[rgb(var(--border))]/40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="h-9 rounded-lg bg-red-600 px-4 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

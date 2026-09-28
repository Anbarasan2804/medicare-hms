import React from 'react';
import { Pencil, Trash2, Inbox } from 'lucide-react';
import { Badge } from './Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { ColumnConfig } from '../../types';

interface TableProps {
  columns: ColumnConfig[];
  rows: Record<string, any>[];
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
  canWrite?: boolean;
  canDelete?: boolean;
  loading?: boolean;
}

function renderCell(col: ColumnConfig, value: any) {
  if (value === null || value === undefined || value === '') return <span className="text-[rgb(var(--muted))]">—</span>;
  switch (col.render) {
    case 'badge':
      return <Badge value={String(value)} />;
    case 'currency':
      return formatCurrency(value);
    case 'date':
      return formatDate(value);
    default:
      return String(value);
  }
}

export function Table({ columns, rows, onEdit, onDelete, canWrite, canDelete, loading }: TableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-[rgb(var(--muted))]">Loading records…</div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-[rgb(var(--muted))]">
        <Inbox className="h-8 w-8" />
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[rgb(var(--border))] text-left text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            {(canWrite || canDelete) && <th className="px-4 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--border))]/20"
            >
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-[rgb(var(--text))]">
                  {renderCell(col, row[col.key])}
                </td>
              ))}
              {(canWrite || canDelete) && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {canWrite && (
                      <button
                        onClick={() => onEdit?.(row)}
                        className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-primary-500/10 hover:text-primary-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete?.(row)}
                        className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-red-500/10 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

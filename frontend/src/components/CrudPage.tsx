import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select, Textarea } from './ui/Input';
import { Table } from './ui/Table';
import { Modal, ConfirmDialog } from './ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ModuleConfig } from '../types';

export function CrudPage({ config }: { config: ModuleConfig }) {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Record<string, any> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canWrite = hasRole(...config.rolesCanWrite);
  const canDelete = hasRole(...config.rolesCanDelete);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/${config.endpoint}`, {
        params: { page, limit: 10, search },
      });
      setRows(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load records', 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openCreate() {
    setEditingRow(null);
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => (initial[f.name] = ''));
    setFormData(initial);
    setModalOpen(true);
  }

  function openEdit(row: Record<string, any>) {
    setEditingRow(row);
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => (initial[f.name] = row[f.name] ?? ''));
    setFormData(initial);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingRow) {
        await api.put(`/${config.endpoint}/${editingRow.id}`, formData);
        showToast(`${config.title.slice(0, -1)} updated successfully`, 'success');
      } else {
        await api.post(`/${config.endpoint}`, formData);
        showToast(`${config.title.slice(0, -1)} created successfully`, 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/${config.endpoint}/${deleteTarget.id}`);
      showToast(`Record deleted`, 'success');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-2 sm:max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
            <Input
              placeholder={config.searchPlaceholder || 'Search…'}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button variant="outline" size="icon" onClick={fetchData} title="Refresh">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          {canWrite && (
            <Button onClick={openCreate} className="ml-auto sm:ml-0">
              <Plus className="h-4 w-4" /> Add {config.title.slice(0, -1)}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table
          columns={config.columns}
          rows={rows}
          onEdit={openEdit}
          onDelete={(row) => setDeleteTarget(row)}
          canWrite={canWrite}
          canDelete={canDelete}
          loading={loading}
        />

        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-between border-t border-[rgb(var(--border))] px-4 py-3">
            <span className="text-xs text-[rgb(var(--muted))]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRow ? `Edit ${config.title.slice(0, -1)}` : `Add ${config.title.slice(0, -1)}`}
        size="lg"
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {field.type === 'select' ? (
                <Select
                  required={field.required}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              ) : (
                <Input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="col-span-full mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingRow ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete record?"
        message="This action cannot be undone. Are you sure you want to delete this record?"
        loading={deleting}
      />
    </Card>
  );
}

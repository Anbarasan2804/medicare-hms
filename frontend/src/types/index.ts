export type Role = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Patient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarColor?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'tel';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: 'badge' | 'currency' | 'date' | 'text';
}

export interface ModuleConfig {
  key: string;
  title: string;
  endpoint: string;
  icon: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  searchPlaceholder?: string;
  rolesCanWrite: Role[];
  rolesCanDelete: Role[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

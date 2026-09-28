/**
 * Central registry of every CRUD module exposed at /api/:resource.
 * Adding a new module = adding one entry here (table, searchable fields,
 * writable fields, and which roles may view / write / delete).
 */
const ALL_ROLES = ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient'];

module.exports = {
  patients: {
    table: 'patients',
    searchableFields: ['name', 'phone', 'email'],
    allowedFields: ['user_id', 'name', 'age', 'gender', 'blood_group', 'phone', 'email', 'address', 'emergency_contact', 'admission_status', 'assigned_doctor_id'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Receptionist', 'Nurse', 'Doctor'], delete: ['Admin'] },
  },
  doctors: {
    table: 'doctors',
    searchableFields: ['name', 'specialization', 'email'],
    allowedFields: ['user_id', 'name', 'specialization', 'department_id', 'qualification', 'experience_years', 'phone', 'email', 'consultation_fee', 'status'],
    roles: { view: ALL_ROLES, write: ['Admin'], delete: ['Admin'] },
  },
  appointments: {
    table: 'appointments',
    searchableFields: ['reason', 'status'],
    allowedFields: ['patient_id', 'doctor_id', 'department_id', 'appointment_date', 'appointment_time', 'reason', 'status'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Receptionist', 'Doctor', 'Nurse'], delete: ['Admin', 'Receptionist'] },
  },
  departments: {
    table: 'departments',
    searchableFields: ['name', 'head_doctor'],
    allowedFields: ['name', 'head_doctor', 'floor', 'total_staff', 'description'],
    roles: { view: ALL_ROLES, write: ['Admin'], delete: ['Admin'] },
  },
  beds: {
    table: 'beds',
    searchableFields: ['bed_number', 'ward', 'status'],
    allowedFields: ['bed_number', 'ward', 'department_id', 'status', 'patient_id', 'rate_per_day'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Nurse', 'Receptionist'], delete: ['Admin'] },
  },
  medicines: {
    table: 'medicines',
    searchableFields: ['name', 'category', 'manufacturer'],
    allowedFields: ['name', 'category', 'manufacturer', 'stock_quantity', 'unit_price', 'expiry_date', 'reorder_level'],
    roles: { view: ALL_ROLES, write: ['Admin'], delete: ['Admin'] },
  },
  'lab-tests': {
    table: 'lab_tests',
    searchableFields: ['test_name', 'test_type', 'status'],
    allowedFields: ['patient_id', 'doctor_id', 'test_name', 'test_type', 'status', 'result', 'test_date', 'cost'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Doctor', 'Nurse'], delete: ['Admin'] },
  },
  prescriptions: {
    table: 'prescriptions',
    searchableFields: ['medicine_name', 'notes'],
    allowedFields: ['patient_id', 'doctor_id', 'medicine_name', 'dosage', 'frequency', 'duration', 'notes', 'date_issued'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Doctor'], delete: ['Admin', 'Doctor'] },
  },
  billing: {
    table: 'billing',
    searchableFields: ['invoice_number', 'description', 'status'],
    allowedFields: ['patient_id', 'invoice_number', 'description', 'amount', 'tax', 'status', 'payment_method', 'billing_date'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Receptionist'], delete: ['Admin'] },
  },
  'medical-records': {
    table: 'medical_records',
    searchableFields: ['diagnosis', 'symptoms'],
    allowedFields: ['patient_id', 'doctor_id', 'diagnosis', 'symptoms', 'treatment', 'notes', 'record_date'],
    roles: { view: ALL_ROLES, write: ['Admin', 'Doctor'], delete: ['Admin', 'Doctor'] },
  },
  staff: {
    table: 'staff',
    searchableFields: ['name', 'role', 'email'],
    allowedFields: ['user_id', 'name', 'role', 'department_id', 'phone', 'email', 'shift', 'joining_date', 'status'],
    roles: { view: ALL_ROLES, write: ['Admin'], delete: ['Admin'] },
  },
  notifications: {
    table: 'notifications',
    searchableFields: ['title', 'message'],
    allowedFields: ['user_id', 'title', 'message', 'type', 'is_read'],
    roles: { view: ALL_ROLES, write: ['Admin'], delete: ['Admin'] },
  },
};

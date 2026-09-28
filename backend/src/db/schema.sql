-- MediCare HMS Database Schema
CREATE DATABASE IF NOT EXISTS medicare_hms;
USE medicare_hms;

-- Users: login + role-based access (Admin, Doctor, Nurse, Receptionist, Patient)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin','Doctor','Nurse','Receptionist','Patient') NOT NULL DEFAULT 'Patient',
  phone VARCHAR(20),
  avatar_color VARCHAR(20) DEFAULT '#2563eb',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  head_doctor VARCHAR(120),
  floor VARCHAR(20),
  total_staff INT DEFAULT 0,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(120) NOT NULL,
  specialization VARCHAR(120),
  department_id INT,
  qualification VARCHAR(150),
  experience_years INT DEFAULT 0,
  phone VARCHAR(20),
  email VARCHAR(150),
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  status ENUM('Available','On Leave','In Surgery','Off Duty') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(120) NOT NULL,
  age INT,
  gender ENUM('Male','Female','Other'),
  blood_group VARCHAR(5),
  phone VARCHAR(20),
  email VARCHAR(150),
  address VARCHAR(255),
  emergency_contact VARCHAR(20),
  admission_status ENUM('Outpatient','Admitted','Discharged') DEFAULT 'Outpatient',
  assigned_doctor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  department_id INT,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  status ENUM('Scheduled','Completed','Cancelled','No Show') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bed_number VARCHAR(20) NOT NULL,
  ward VARCHAR(60) NOT NULL,
  department_id INT,
  status ENUM('Available','Occupied','Cleaning','Reserved') DEFAULT 'Available',
  patient_id INT,
  rate_per_day DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80),
  manufacturer VARCHAR(120),
  stock_quantity INT DEFAULT 0,
  unit_price DECIMAL(10,2) DEFAULT 0,
  expiry_date DATE,
  reorder_level INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  test_name VARCHAR(150) NOT NULL,
  test_type VARCHAR(80),
  status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
  result TEXT,
  test_date DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  medicine_name VARCHAR(150),
  dosage VARCHAR(80),
  frequency VARCHAR(80),
  duration VARCHAR(80),
  notes VARCHAR(255),
  date_issued DATE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS billing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  invoice_number VARCHAR(40) NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  status ENUM('Paid','Pending','Overdue','Cancelled') DEFAULT 'Pending',
  payment_method VARCHAR(40),
  billing_date DATE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  diagnosis VARCHAR(255),
  symptoms VARCHAR(255),
  treatment TEXT,
  notes TEXT,
  record_date DATE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(80),
  department_id INT,
  phone VARCHAR(20),
  email VARCHAR(150),
  shift VARCHAR(40),
  joining_date DATE,
  status ENUM('Active','On Leave','Inactive') DEFAULT 'Active',
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(150),
  message VARCHAR(255),
  type ENUM('info','success','warning','error') DEFAULT 'info',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

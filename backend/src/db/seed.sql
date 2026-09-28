USE medicare_hms;

-- Demo password for ALL seeded accounts below is: Password@123
INSERT INTO users (name, email, password, role, phone, avatar_color) VALUES
('Arjun Mehta', 'admin@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Admin', '9876500001', '#7c3aed'),
('Dr. Priya Sharma', 'priya.sharma@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Doctor', '9876500002', '#2563eb'),
('Dr. Karthik Rao', 'karthik.rao@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Doctor', '9876500003', '#0891b2'),
('Dr. Fatima Khan', 'fatima.khan@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Doctor', '9876500004', '#059669'),
('Nurse Lakshmi Iyer', 'lakshmi.iyer@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Nurse', '9876500005', '#db2777'),
('Nurse Ravi Kumar', 'ravi.kumar@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Nurse', '9876500006', '#ea580c'),
('Sneha Patil', 'sneha.patil@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Receptionist', '9876500007', '#0d9488'),
('Anitha Reddy', 'anitha.reddy@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Patient', '9876500008', '#4338ca'),
('Vikram Singh', 'vikram.singh@medicare.com', '$2a$10$o10I5fSLE94hw.epJfeTYecgw7I0Nixli3kLi/ICiUIFQshB4bm5e', 'Patient', '9876500009', '#b91c1c');

INSERT INTO departments (name, head_doctor, floor, total_staff, description) VALUES
('Cardiology', 'Dr. Priya Sharma', '3rd Floor', 18, 'Heart and cardiovascular care'),
('Neurology', 'Dr. Karthik Rao', '4th Floor', 14, 'Brain and nervous system disorders'),
('Orthopedics', 'Dr. Fatima Khan', '2nd Floor', 12, 'Bone, joint and muscle care'),
('Pediatrics', 'Dr. Priya Sharma', '1st Floor', 16, 'Child healthcare services'),
('General Medicine', 'Dr. Karthik Rao', 'Ground Floor', 22, 'General diagnosis and treatment'),
('Emergency', 'Dr. Fatima Khan', 'Ground Floor', 25, '24x7 emergency and trauma care');

INSERT INTO doctors (user_id, name, specialization, department_id, qualification, experience_years, phone, email, consultation_fee, status) VALUES
(2, 'Dr. Priya Sharma', 'Cardiologist', 1, 'MBBS, MD (Cardiology)', 12, '9876500002', 'priya.sharma@medicare.com', 800, 'Available'),
(3, 'Dr. Karthik Rao', 'Neurologist', 2, 'MBBS, DM (Neurology)', 9, '9876500003', 'karthik.rao@medicare.com', 900, 'In Surgery'),
(4, 'Dr. Fatima Khan', 'Orthopedic Surgeon', 3, 'MBBS, MS (Ortho)', 15, '9876500004', 'fatima.khan@medicare.com', 750, 'Available'),
(NULL, 'Dr. Suresh Nair', 'Pediatrician', 4, 'MBBS, MD (Pediatrics)', 7, '9876500010', 'suresh.nair@medicare.com', 600, 'On Leave'),
(NULL, 'Dr. Meera Joshi', 'General Physician', 5, 'MBBS', 5, '9876500011', 'meera.joshi@medicare.com', 500, 'Available');

INSERT INTO patients (user_id, name, age, gender, blood_group, phone, email, address, emergency_contact, admission_status, assigned_doctor_id) VALUES
(8, 'Anitha Reddy', 34, 'Female', 'O+', '9876500008', 'anitha.reddy@medicare.com', '12 MG Road, Bengaluru', '9876511111', 'Outpatient', 1),
(9, 'Vikram Singh', 45, 'Male', 'B+', '9876500009', 'vikram.singh@medicare.com', '45 Nehru Nagar, Bengaluru', '9876522222', 'Admitted', 2),
(NULL, 'Divya Menon', 29, 'Female', 'A+', '9876500012', 'divya.menon@example.com', '78 Indira Nagar, Bengaluru', '9876533333', 'Outpatient', 3),
(NULL, 'Rahul Verma', 52, 'Male', 'AB-', '9876500013', 'rahul.verma@example.com', '23 Koramangala, Bengaluru', '9876544444', 'Admitted', 1),
(NULL, 'Kavya Nambiar', 8, 'Female', 'O-', '9876500014', 'parent.nambiar@example.com', '90 Jayanagar, Bengaluru', '9876555555', 'Outpatient', 4),
(NULL, 'Manoj Tiwari', 61, 'Male', 'B-', '9876500015', 'manoj.tiwari@example.com', '5 Malleswaram, Bengaluru', '9876566666', 'Discharged', 5);

INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status) VALUES
(1, 1, 1, CURDATE(), '10:00 AM', 'Routine heart checkup', 'Scheduled'),
(2, 2, 2, CURDATE(), '11:30 AM', 'Migraine follow-up', 'Scheduled'),
(3, 3, 3, CURDATE(), '02:00 PM', 'Knee pain evaluation', 'Completed'),
(4, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00 AM', 'Post-surgery review', 'Scheduled'),
(5, 4, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '03:30 PM', 'Child vaccination', 'Scheduled'),
(6, 5, 5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '01:00 PM', 'General fever', 'Completed');

INSERT INTO beds (bed_number, ward, department_id, status, patient_id, rate_per_day) VALUES
('C-101', 'Cardiology Ward', 1, 'Occupied', 2, 2500),
('C-102', 'Cardiology Ward', 1, 'Available', NULL, 2500),
('N-201', 'Neurology Ward', 2, 'Cleaning', NULL, 2800),
('O-301', 'Orthopedics Ward', 3, 'Occupied', 4, 2200),
('G-401', 'General Ward', 5, 'Available', NULL, 1500),
('E-501', 'Emergency Ward', 6, 'Reserved', NULL, 3000);

INSERT INTO medicines (name, category, manufacturer, stock_quantity, unit_price, expiry_date, reorder_level) VALUES
('Paracetamol 500mg', 'Analgesic', 'Cipla', 500, 2.5, '2027-06-30', 100),
('Amoxicillin 250mg', 'Antibiotic', 'Sun Pharma', 200, 8.0, '2026-12-31', 50),
('Atorvastatin 10mg', 'Cardiac', 'Dr. Reddy\'s', 150, 12.0, '2027-03-31', 40),
('Metformin 500mg', 'Antidiabetic', 'Cipla', 300, 5.5, '2027-01-31', 60),
('Cetirizine 10mg', 'Antihistamine', 'Mankind', 400, 1.8, '2026-11-30', 80),
('Ibuprofen 400mg', 'Analgesic', 'Sun Pharma', 18, 3.2, '2026-10-15', 30),
('Omeprazole 20mg', 'Antacid', 'Mankind', 250, 6.0, '2027-05-31', 50);

INSERT INTO lab_tests (patient_id, doctor_id, test_name, test_type, status, result, test_date, cost) VALUES
(1, 1, 'Lipid Profile', 'Blood Test', 'Completed', 'Cholesterol slightly elevated, follow-up advised', CURDATE(), 600),
(2, 2, 'MRI Brain', 'Imaging', 'In Progress', NULL, CURDATE(), 4500),
(3, 3, 'X-Ray Knee', 'Imaging', 'Completed', 'Minor cartilage wear, no fracture', CURDATE(), 800),
(4, 1, 'ECG', 'Cardiac Test', 'Pending', NULL, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 400),
(6, 5, 'CBC', 'Blood Test', 'Completed', 'Normal range', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 350);

INSERT INTO prescriptions (patient_id, doctor_id, medicine_name, dosage, frequency, duration, notes, date_issued) VALUES
(1, 1, 'Atorvastatin 10mg', '1 tablet', 'Once daily at night', '30 days', 'Take after dinner', CURDATE()),
(2, 2, 'Ibuprofen 400mg', '1 tablet', 'Twice daily', '7 days', 'For migraine pain relief', CURDATE()),
(3, 3, 'Paracetamol 500mg', '1 tablet', 'As needed', '5 days', 'For knee pain', CURDATE()),
(4, 1, 'Metformin 500mg', '1 tablet', 'Twice daily', '60 days', 'Monitor blood sugar', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(6, 5, 'Cetirizine 10mg', '1 tablet', 'Once daily', '5 days', 'For allergy symptoms', DATE_SUB(CURDATE(), INTERVAL 2 DAY));

INSERT INTO billing (patient_id, invoice_number, description, amount, tax, status, payment_method, billing_date) VALUES
(1, 'INV-2026-0001', 'Consultation + Lipid Profile', 1400, 70, 'Paid', 'Card', CURDATE()),
(2, 'INV-2026-0002', 'MRI Brain Scan + Consultation', 5400, 270, 'Pending', NULL, CURDATE()),
(3, 'INV-2026-0003', 'X-Ray + Consultation', 1550, 77.5, 'Paid', 'UPI', CURDATE()),
(4, 'INV-2026-0004', 'Room Charges (Orthopedics, 3 days)', 6600, 330, 'Overdue', NULL, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(6, 'INV-2026-0005', 'General Consultation + CBC', 850, 42.5, 'Paid', 'Cash', DATE_SUB(CURDATE(), INTERVAL 2 DAY));

INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, treatment, notes, record_date) VALUES
(1, 1, 'Mild Hypercholesterolemia', 'Occasional chest discomfort', 'Statin therapy, dietary changes', 'Review in 3 months', CURDATE()),
(2, 2, 'Chronic Migraine', 'Recurring headaches, light sensitivity', 'MRI ordered, prescribed pain management', 'Neurology follow-up scheduled', CURDATE()),
(3, 3, 'Mild Knee Osteoarthritis', 'Knee pain on movement', 'Physiotherapy recommended', 'X-ray shows minor wear', CURDATE()),
(4, 1, 'Type 2 Diabetes, Post-op recovery', 'Fatigue, elevated blood sugar', 'Metformin, dietary control', 'Admitted for monitoring', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

INSERT INTO staff (user_id, name, role, department_id, phone, email, shift, joining_date, status) VALUES
(5, 'Lakshmi Iyer', 'Head Nurse', 1, '9876500005', 'lakshmi.iyer@medicare.com', 'Morning', '2019-04-12', 'Active'),
(6, 'Ravi Kumar', 'Staff Nurse', 6, '9876500006', 'ravi.kumar@medicare.com', 'Night', '2021-08-01', 'Active'),
(7, 'Sneha Patil', 'Receptionist', 5, '9876500007', 'sneha.patil@medicare.com', 'Morning', '2022-01-15', 'Active'),
(NULL, 'Deepak Chawla', 'Lab Technician', 2, '9876500016', 'deepak.chawla@medicare.com', 'Evening', '2020-06-20', 'On Leave'),
(NULL, 'Pooja Bhatt', 'Pharmacist', 5, '9876500017', 'pooja.bhatt@medicare.com', 'Morning', '2023-03-10', 'Active');

INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(1, 'New Appointment', 'A new appointment has been scheduled for today at 10:00 AM.', 'info', 0),
(1, 'Low Stock Alert', 'Ibuprofen 400mg stock is below reorder level (18 units left).', 'warning', 0),
(2, 'Lab Result Ready', 'MRI Brain result for Vikram Singh is now available.', 'success', 0),
(1, 'Payment Overdue', 'Invoice INV-2026-0004 is overdue.', 'error', 0),
(3, 'Shift Reminder', 'Your evening shift starts at 4:00 PM today.', 'info', 1);

const express = require('express');
const { pool } = require('../config/db');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats - aggregate KPIs + chart data for the dashboard
router.get('/stats', protect, async (req, res, next) => {
  try {
    const [[patients]] = await pool.query('SELECT COUNT(*) AS count FROM patients');
    const [[doctors]] = await pool.query('SELECT COUNT(*) AS count FROM doctors');
    const [[appointmentsToday]] = await pool.query(
      'SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = CURDATE()'
    );
    const [[bedsAvailable]] = await pool.query("SELECT COUNT(*) AS count FROM beds WHERE status = 'Available'");
    const [[bedsTotal]] = await pool.query('SELECT COUNT(*) AS count FROM beds');
    const [[revenue]] = await pool.query(
      "SELECT COALESCE(SUM(amount + tax), 0) AS total FROM billing WHERE status = 'Paid'"
    );
    const [[pendingBills]] = await pool.query("SELECT COUNT(*) AS count FROM billing WHERE status IN ('Pending','Overdue')");

    const [appointmentsByStatus] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM appointments GROUP BY status'
    );
    const [patientsByDepartment] = await pool.query(`
      SELECT d.name AS department, COUNT(p.id) AS count
      FROM departments d
      LEFT JOIN doctors doc ON doc.department_id = d.id
      LEFT JOIN patients p ON p.assigned_doctor_id = doc.id
      GROUP BY d.name
    `);
    const [revenueByMonth] = await pool.query(`
      SELECT DATE_FORMAT(billing_date, '%b') AS month, SUM(amount + tax) AS total
      FROM billing
      WHERE billing_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY MONTH(billing_date), DATE_FORMAT(billing_date, '%b')
      ORDER BY MONTH(billing_date)
    `);
    const [lowStockMedicines] = await pool.query(
      'SELECT id, name, stock_quantity, reorder_level FROM medicines WHERE stock_quantity <= reorder_level'
    );

    res.json({
      success: true,
      data: {
        kpis: {
          totalPatients: patients.count,
          totalDoctors: doctors.count,
          appointmentsToday: appointmentsToday.count,
          bedsAvailable: bedsAvailable.count,
          bedsTotal: bedsTotal.count,
          totalRevenue: Number(revenue.total),
          pendingBills: pendingBills.count,
        },
        appointmentsByStatus,
        patientsByDepartment,
        revenueByMonth,
        lowStockMedicines,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/reports - deeper breakdowns for the Reports page
router.get('/reports', protect, authorize('Admin', 'Doctor'), async (req, res, next) => {
  try {
    const [billingByStatus] = await pool.query(
      'SELECT status, COUNT(*) AS count, COALESCE(SUM(amount + tax), 0) AS total FROM billing GROUP BY status'
    );
    const [bedOccupancyByDepartment] = await pool.query(`
      SELECT d.name AS department,
        SUM(CASE WHEN b.status = 'Occupied' THEN 1 ELSE 0 END) AS occupied,
        COUNT(b.id) AS total
      FROM departments d
      LEFT JOIN beds b ON b.department_id = d.id
      GROUP BY d.name
    `);
    const [doctorPerformance] = await pool.query(`
      SELECT doc.name AS doctor, doc.specialization,
        COUNT(a.id) AS totalAppointments,
        SUM(CASE WHEN a.status = 'Completed' THEN 1 ELSE 0 END) AS completed
      FROM doctors doc
      LEFT JOIN appointments a ON a.doctor_id = doc.id
      GROUP BY doc.id, doc.name, doc.specialization
      ORDER BY totalAppointments DESC
    `);
    const [labTestsByStatus] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM lab_tests GROUP BY status'
    );

    res.json({
      success: true,
      data: { billingByStatus, bedOccupancyByDepartment, doctorPerformance, labTestsByStatus },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

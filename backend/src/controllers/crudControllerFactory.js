const { pool } = require('../config/db');

/**
 * Generic, reusable REST CRUD controller factory.
 * Table/column names below always come from trusted server-side config
 * (never from request input), so they are safe to interpolate; all
 * user-supplied values are passed through parameterized queries.
 *
 * config = {
 *   table: 'patients',
 *   searchableFields: ['name', 'phone', 'email'],
 *   allowedFields: ['name', 'age', 'gender', ...]   // fields clients may write
 * }
 */
function createCrudController(config) {
  const { table, searchableFields = [], allowedFields = [] } = config;

  function pickAllowed(body) {
    const out = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        out[key] = body[key] === '' ? null : body[key];
      }
    }
    return out;
  }

  return {
    // GET /api/:resource?page=1&limit=10&search=&sortBy=id&sortDir=DESC
    async list(req, res, next) {
      try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;
        const search = (req.query.search || '').trim();

        let where = '';
        const params = [];
        if (search && searchableFields.length) {
          where = 'WHERE ' + searchableFields.map((f) => `${f} LIKE ?`).join(' OR ');
          searchableFields.forEach(() => params.push(`%${search}%`));
        }

        const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM ${table} ${where}`, params);
        const total = countRows[0].total;

        const [rows] = await pool.query(
          `SELECT * FROM ${table} ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset]
        );

        res.json({
          success: true,
          data: rows,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        });
      } catch (err) {
        next(err);
      }
    },

    // GET /api/:resource/:id
    async getById(req, res, next) {
      try {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!rows[0]) return res.status(404).json({ success: false, message: `${table} record not found` });
        res.json({ success: true, data: rows[0] });
      } catch (err) {
        next(err);
      }
    },

    // POST /api/:resource
    async create(req, res, next) {
      try {
        const data = pickAllowed(req.body);
        if (!Object.keys(data).length) {
          return res.status(400).json({ success: false, message: 'No valid fields provided' });
        }
        const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
        res.status(201).json({ success: true, data: rows[0] });
      } catch (err) {
        next(err);
      }
    },

    // PUT /api/:resource/:id
    async update(req, res, next) {
      try {
        const data = pickAllowed(req.body);
        if (!Object.keys(data).length) {
          return res.status(400).json({ success: false, message: 'No valid fields provided' });
        }
        const [existing] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!existing[0]) return res.status(404).json({ success: false, message: `${table} record not found` });

        await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, req.params.id]);
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
        res.json({ success: true, data: rows[0] });
      } catch (err) {
        next(err);
      }
    },

    // DELETE /api/:resource/:id
    async remove(req, res, next) {
      try {
        const [existing] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!existing[0]) return res.status(404).json({ success: false, message: `${table} record not found` });

        await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
        res.json({ success: true, message: `${table} record deleted` });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = { createCrudController };

const express = require('express');
const { body, validationResult } = require('express-validator');
const { login, register, me, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
}

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  validate,
  login
);

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient']),
  ],
  validate,
  register
);

router.get('/me', protect, me);
router.put('/change-password', protect, changePassword);

module.exports = router;

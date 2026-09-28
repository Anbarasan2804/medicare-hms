const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { createCrudController } = require('../controllers/crudControllerFactory');
const moduleConfig = require('./moduleConfig');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

// Build a full REST router (GET list, GET :id, POST, PUT :id, DELETE :id)
// for every module declared in moduleConfig.js, enforcing that module's
// own role permissions on write/delete.
Object.entries(moduleConfig).forEach(([resource, config]) => {
  const controller = createCrudController(config);
  const moduleRouter = express.Router();
  const { view, write, delete: del } = config.roles;

  moduleRouter.get('/', protect, authorize(...view), controller.list);
  moduleRouter.get('/:id', protect, authorize(...view), controller.getById);
  moduleRouter.post('/', protect, authorize(...write), controller.create);
  moduleRouter.put('/:id', protect, authorize(...write), controller.update);
  moduleRouter.delete('/:id', protect, authorize(...del), controller.remove);

  router.use(`/${resource}`, moduleRouter);
});

module.exports = router;

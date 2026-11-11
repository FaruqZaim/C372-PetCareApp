const express = require('express');
const controller = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/admin/dashboard', isAdmin, controller.dashboard);
router.get('/admin/users', isAdmin, controller.listUsers);
router.get('/admin/users/:id', isAdmin, controller.showUser);
router.get('/admin/users/delete/:id', isAdmin, controller.deleteUser);

module.exports = router;

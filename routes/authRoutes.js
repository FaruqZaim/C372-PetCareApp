const express = require('express');
const controller = require('../controllers/authController');
const upload = require('../config/upload');
const router = express.Router();

router.get('/signup', controller.showSignup);
router.post('/signup', upload.single('pet_image'), controller.signup);
router.get('/login', controller.showLogin);
router.post('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;

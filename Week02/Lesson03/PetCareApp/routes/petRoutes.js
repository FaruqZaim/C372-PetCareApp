const express = require('express');
const controller = require('../controllers/petController');
const upload = require('../config/upload');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/pets/new', isLoggedIn, controller.showNewPet);
router.post('/pets', upload.single('pet_image'), isLoggedIn, controller.createPet);

module.exports = router;

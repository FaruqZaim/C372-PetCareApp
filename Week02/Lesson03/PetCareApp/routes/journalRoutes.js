const express = require('express');
const controller = require('../controllers/journalController');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/journals', isLoggedIn, controller.listJournals);
router.get('/journals/new', isLoggedIn, controller.showNewJournal);
router.post('/journals/new', isLoggedIn, controller.createJournal);
router.get('/journals/edit/:id', isLoggedIn, controller.showEditJournal);
router.post('/journals/edit/:id', isLoggedIn, controller.updateJournal);
router.get('/journals/delete/:id', isLoggedIn, controller.deleteJournal);
router.get('/journals/search', isLoggedIn, controller.searchJournals);

module.exports = router;

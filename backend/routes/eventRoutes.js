const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes for fetching events
router.route('/').get(getEvents);
router.route('/:id').get(getEventById);

// Admin-only routes for managing events
router.route('/').post(protect, admin, createEvent);
router.route('/:id').put(protect, admin, updateEvent).delete(protect, admin, deleteEvent);

module.exports = router;

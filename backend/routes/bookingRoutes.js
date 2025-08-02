const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { bookingLogger } = require('../middleware/bookingLogger');

// Route to get all bookings for the logged-in user
router.route('/mybookings').get(protect, getMyBookings);

// Route to create a new booking
// The bookingLogger middleware will run after protect but before createBooking
router.route('/').post(protect, bookingLogger, createBooking);

// Route to cancel a specific booking by its ID
router.route('/:id/cancel').put(protect, cancelBooking);

module.exports = router;

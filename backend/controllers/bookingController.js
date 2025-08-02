const Booking = require('../models/BookingModel');
const Event = require('../models/EventModel');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res) => {
  const { eventId, seats } = req.body;
  const userId = req.user.id;

  try {
    // Find the event the user wants to book
    const event = await Event.findById(eventId);

    // 1. Check if the event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 2. Check if the event is already completed
    if (new Date(event.date) < new Date()) {
        return res.status(400).json({ message: 'This event has already passed' });
    }

    // 3. Check if the user has already booked this event
    const existingBooking = await Booking.findOne({ user: userId, event: eventId, bookingStatus: 'Confirmed' });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    // 4. Validate number of seats (must be 1 or 2)
    if (!seats || seats < 1 || seats > 2) {
      return res.status(400).json({ message: 'You can book a minimum of 1 and a maximum of 2 seats' });
    }

    // 5. Check for event capacity
    if (event.attendees.length + seats > event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Create and save the new booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      seats,
    });
    const createdBooking = await booking.save();

    // Add the user to the event's attendees list
    for (let i = 0; i < seats; i++) {
        event.attendees.push(userId);
    }
    await event.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
};

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, bookingStatus: 'Confirmed' }).populate('event', 'name date location eventId');
    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event');

        // 1. Check if booking exists
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Check if the booking belongs to the user trying to cancel it
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // 3. Check if booking is already cancelled
        if (booking.bookingStatus === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // 4. Check if the event has already started
        if (new Date(booking.event.date) < new Date()) {
            return res.status(400).json({ message: 'Cannot cancel a booking for an event that has already started or completed' });
        }

        // Update booking status
        booking.bookingStatus = 'Cancelled';
        await booking.save();

        // Remove user from the event's attendees list
        const event = await Event.findById(booking.event._id);
        if (event) {
            const userAttendees = event.attendees.filter(attendeeId => attendeeId.toString() === req.user.id);
            // Remove the correct number of seats
            for (let i = 0; i < booking.seats && userAttendees.length > 0; i++) {
                const indexToRemove = event.attendees.findIndex(attendeeId => attendeeId.toString() === req.user.id);
                if (indexToRemove > -1) {
                    event.attendees.splice(indexToRemove, 1);
                }
            }
            await event.save();
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error while cancelling booking' });
    }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};

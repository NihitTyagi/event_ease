/**
 * @desc    Logs information about a new booking request.
 * This middleware should be placed before the booking creation controller.
 */
const bookingLogger = (req, res, next) => {
  // Check if the request is for creating a booking
  if (req.method === 'POST' && req.body.eventId) {
    const userId = req.user ? req.user.id : 'Unknown User';
    const { eventId, seats } = req.body;
    const timestamp = new Date().toISOString();

    console.log(
      `[BOOKING LOG] Timestamp: ${timestamp} | User: ${userId} | EventID: ${eventId} | Seats: ${seats}`
    );
  }
  // Pass control to the next middleware in the stack
  next();
};

module.exports = { bookingLogger };

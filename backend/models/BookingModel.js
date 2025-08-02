// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define the Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    // Reference to the user who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Reference to the event that was booked
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    // Number of seats booked by the user (max 2)
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
    // Status of the booking
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);

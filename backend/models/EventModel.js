// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define the Event Schema
const eventSchema = new mongoose.Schema(
  {
    // Custom unique ID for the event, e.g., EVT-AUG2025-X4T
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    // Name of the event
    name: {
      type: String,
      required: [true, 'Please add an event name'],
      trim: true,
    },
    // Detailed description of the event
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    // Category of the event (e.g., Music, Tech)
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    // Location of the event (can be 'Online' or a physical address)
    location: {
      type: String,
      required: true,
    },
    // Date and time of the event
    date: {
      type: Date,
      required: true,
    },
    // Maximum number of attendees
    capacity: {
      type: Number,
      required: true,
    },
    // List of users who have booked this event
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
    // Enable virtuals to be included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to dynamically determine the event status
eventSchema.virtual('status').get(function () {
  const now = new Date();
  const eventDate = new Date(this.date);

  // Normalize dates to compare day-by-day, ignoring time
  now.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate < now) {
    return 'Completed';
  } else if (eventDate.getTime() === now.getTime()) {
    return 'Ongoing';
  } else {
    return 'Upcoming';
  }
});

// Export the Event model
module.exports = mongoose.model('Event', eventSchema);

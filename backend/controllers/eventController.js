const Event = require('../models/EventModel');
const User = require('../models/UserModel');

/**
 * Generates a custom event ID in the format: EVT-[MMM][YYYY]-[Random3]
 * @param {Date} date - The date of the event.
 * @returns {string} The generated custom event ID.
 */
const generateEventId = (date) => {
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `EVT-${month}${year}-${randomChars}`;
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
const createEvent = async (req, res) => {
  const { name, description, category, location, date, capacity } = req.body;
  try {
    const eventDate = new Date(date);
    const eventId = generateEventId(eventDate);
    const event = new Event({
      eventId, name, description, category, location, date: eventDate, capacity, attendees: [],
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

/**
 * @desc    Get all events, sorted by Upcoming then Ongoing
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of today

    // 1. Fetch all events that are not completed
    const events = await Event.find({ date: { $gte: today } });

    // 2. Sort the results in JavaScript based on the virtual 'status' property
    events.sort((a, b) => {
      const statusOrder = { 'Upcoming': 1, 'Ongoing': 2 };

      // If the statuses are different, sort by the predefined order (Upcoming first)
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }

      // If statuses are the same (e.g., both are 'Upcoming'), sort by the event date (soonest first)
      return new Date(a.date) - new Date(b.date);
    });

    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

/**
 * @desc    Get a single event by its database ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
const updateEvent = async (req, res) => {
  const { name, description, category, location, date, capacity } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.name = name || event.name;
      event.description = description || event.description;
      event.category = category || event.category;
      event.location = location || event.location;
      event.date = date || event.date;
      event.capacity = capacity || event.capacity;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

/**
 * @desc    Get all attendees for a specific event
 * @route   GET /api/events/:id/attendees
 * @access  Private/Admin
 */
const getEventAttendees = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('attendees', 'username email');
        if (event) {
            res.json(event.attendees);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error while fetching attendees' });
    }
};


module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAttendees,
};

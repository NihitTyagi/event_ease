const Event = require('../models/EventModel');

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
      eventId,
      name,
      description,
      category,
      location,
      date: eventDate,
      capacity,
      attendees: [],
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
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
    console.error(error.message);
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
    console.error(error.message);
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
      await event.deleteOne(); // Mongoose v6+ uses deleteOne() on the document
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

import axios from 'axios';

const API_URL = '/api/events/';

const getAuthApi = (token) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

/**
 * @desc    Get all events from the backend
 * @returns {Array} An array of event objects
 */
const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * @desc    Get a single event by its ID
 * @param   {string} eventId - The ID of the event
 * @returns {object} The event object
 */
const getEventById = async (eventId) => {
    const response = await axios.get(API_URL + eventId);
    return response.data;
};

/**
 * @desc    Create a new event
 * @param   {object} eventData - The data for the new event
 * @param   {string} token - The admin user's auth token
 * @returns {object} The newly created event object
 */
const createEvent = async (eventData, token) => {
    const api = getAuthApi(token);
    const response = await api.post('/', eventData);
    return response.data;
};

/**
 * @desc    Update an event
 * @param   {string} eventId - The ID of the event to update
 * @param   {object} eventData - The new data for the event
 * @param   {string} token - The admin user's auth token
 * @returns {object} The updated event object
 */
const updateEvent = async (eventId, eventData, token) => {
    const api = getAuthApi(token);
    const response = await api.put(`/${eventId}`, eventData);
    return response.data;
};

/**
 * @desc    Delete an event
 * @param   {string} eventId - The ID of the event to delete
 * @param   {string} token - The admin user's auth token
 * @returns {object} A confirmation message
 */
const deleteEvent = async (eventId, token) => {
    const api = getAuthApi(token);
    const response = await api.delete(`/${eventId}`);
    return response.data;
}

/**
 * @desc    Get attendees for a specific event
 * @param   {string} eventId - The ID of the event
 * @param   {string} token - The admin user's auth token
 * @returns {Array} An array of attendee user objects
 */
const getEventAttendees = async (eventId, token) => {
    const api = getAuthApi(token);
    // This endpoint needs to be created on the backend
    const response = await api.get(`/${eventId}/attendees`);
    return response.data;
}

const eventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
};

export default eventService;

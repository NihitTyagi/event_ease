import axios from 'axios';

const API_URL = '/api/bookings/';

/**
 * @desc    Create a new booking
 * @param   {object} bookingData - The data for the booking (eventId, seats)
 * @param   {string} token - The user's authentication token
 * @returns {object} The newly created booking object
 */
const createBooking = async (bookingData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, bookingData, config);
  return response.data;
};

/**
 * @desc    Get user's bookings
 * @param   {string} token - The user's authentication token
 * @returns {Array} An array of booking objects
 */
const getMyBookings = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'mybookings', config);
  return response.data;
};

/**
 * @desc    Cancel a booking
 * @param   {string} bookingId - The ID of the booking to cancel
 * @param   {string} token - The user's authentication token
 * @returns {object} A success message
 */
const cancelBooking = async (bookingId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + `${bookingId}/cancel`, {}, config);
  return response.data;
};

const bookingService = {
  createBooking,
  getMyBookings,
  cancelBooking,
};

export default bookingService;

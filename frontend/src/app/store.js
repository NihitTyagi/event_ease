import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice'; // Make sure this import exists
import bookingReducer from '../features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    // The keys here are how we'll access the state in our components
    auth: authReducer,
    events: eventReducer, // This line was likely missing. It registers the event slice.
    bookings: bookingReducer,
  },
});

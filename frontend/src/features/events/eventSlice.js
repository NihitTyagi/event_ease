import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from './eventService';

const initialState = {
  events: [],
  event: null, // To store a single event
  currentEventAttendees: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all events
export const getEvents = createAsyncThunk('events/getAll', async (_, thunkAPI) => {
    try { return await eventService.getEvents(); } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Get single event by ID
export const getEventById = createAsyncThunk('events/getById', async (eventId, thunkAPI) => {
    try { return await eventService.getEventById(eventId); } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create new event (Admin)
export const createEvent = createAsyncThunk('events/create', async (eventData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await eventService.createEvent(eventData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Update an event (Admin)
export const updateEvent = createAsyncThunk('events/update', async ({ eventId, eventData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return await eventService.updateEvent(eventId, eventData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete an event (Admin)
export const deleteEvent = createAsyncThunk('events/delete', async (eventId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        await eventService.deleteEvent(eventId, token);
        return eventId;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get attendees for an event (Admin)
export const getEventAttendees = createAsyncThunk('events/getAttendees', async (eventId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return await eventService.getEventAttendees(eventId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    reset: (state) => {
        state.event = null;
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = '';
    },
    resetAttendees: (state) => { state.currentEventAttendees = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => { state.isLoading = true; })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(getEventById.pending, (state) => { state.isLoading = true; })
      .addCase(getEventById.fulfilled, (state, action) => {
          state.isLoading = false; state.isSuccess = true; state.event = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
          state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(createEvent.pending, (state) => { state.isLoading = true; })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(updateEvent.pending, (state) => { state.isLoading = true; })
      .addCase(updateEvent.fulfilled, (state, action) => {
          state.isLoading = false; state.isSuccess = true;
          const index = state.events.findIndex(event => event._id === action.payload._id);
          if (index !== -1) { state.events[index] = action.payload; }
      })
      .addCase(updateEvent.rejected, (state, action) => {
          state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => { state.isLoading = true; })
      .addCase(deleteEvent.fulfilled, (state, action) => {
          state.isLoading = false; state.isSuccess = true;
          state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
          state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(getEventAttendees.pending, (state) => { state.isLoading = true; })
      .addCase(getEventAttendees.fulfilled, (state, action) => {
          state.isLoading = false; state.isSuccess = true; state.currentEventAttendees = action.payload;
      })
      .addCase(getEventAttendees.rejected, (state, action) => {
          state.isLoading = false; state.isError = true; state.message = action.payload; state.currentEventAttendees = [];
      });
  },
});

export const { reset, resetAttendees } = eventSlice.actions;
export default eventSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from './bookingService';

const initialState = {
  bookings: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await bookingService.createBooking(bookingData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user's bookings
export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await bookingService.getMyBookings(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await bookingService.cancelBooking(bookingId, token);
      return bookingId;
    } catch (error)
    {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter(
          (booking) => booking._id !== action.payload
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;

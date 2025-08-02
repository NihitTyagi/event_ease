const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


dotenv.config();

connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the EventEase API!' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

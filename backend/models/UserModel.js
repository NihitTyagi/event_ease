// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    // Username for the user
    username: {
      type: String,
      required: [true, 'Please add a username'],
      trim: true,
    },
    // Email for the user, must be unique
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    // Password for the user
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    // Role of the user, can only be 'user' or 'admin'
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the User model
module.exports = mongoose.model('User', userSchema);

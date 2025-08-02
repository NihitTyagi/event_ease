// Import the Mongoose library
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB cluster
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a success message to the console if the connection is successful
    console.log(`MongoDB Connected`);
  } catch (error) {
    // Log the error message to the console
    console.error(`Error: ${error.message}`);
    // Exit the Node.js process with a failure code (1)
    process.exit(1);
  }
};

// Export the function to be used in other parts of the application
module.exports = connectDB;

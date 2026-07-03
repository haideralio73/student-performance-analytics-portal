/**
 * config/db.js — MongoDB connection helper.
 *
 * Uses Mongoose to establish a connection to the database URI
 * specified in the MONGO_URI environment variable.
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

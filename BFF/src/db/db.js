import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import Logger from '../utils/Logger.js';

export async function connectDB() {
  try {
    Logger.info(`Connecting to MongoDB...`, { url: ENV.MONGO_URL.replace(/:([^:@]{1,})@/, ':****@') });

    const connection = await mongoose.connect(ENV.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    Logger.info('Successfully connected to MongoDB database.', {
      host: connection.connection.host,
      name: connection.connection.name,
    });

    return connection;
  } catch (err) {
    Logger.error('Failed to connect to MongoDB. Server will operate with local seed cache fallbacks.', {
      error: err.message,
    });
    return null;
  }
}

export default connectDB;
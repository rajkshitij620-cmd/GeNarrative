import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rasa_cue';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'rasa_cue',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to remote/local MongoDB (${error.message}).`);
    console.log(`[MongoDB] Activating high-resilience built-in memory store for hackathon demonstration...`);
    return false;
  }
};

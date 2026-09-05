import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skill_gap_analyzer') as string;
    const conn = await mongoose.connect(connStr, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection event error:', err);
});

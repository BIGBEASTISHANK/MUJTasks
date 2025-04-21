import mongoose from 'mongoose';

const MONGODB_URI = process.env.ASSIGNMENTFORM_MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the ASSIGNMENTFORM_MONGODB_URI environment variable');
}

// Define a more specific type for the cached connection
interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize the global mongoose object with proper typing
declare global {
  var mongoose: ConnectionCache;
}

// Initialize the cache
let cached: ConnectionCache = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose;
}

async function assignmentFormdbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('Connected to MongoDB database:', cached.conn.connection?.db?.databaseName || 'unknown');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default assignmentFormdbConnect;

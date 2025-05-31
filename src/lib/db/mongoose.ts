import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;
const isDisabled: boolean = true;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseURI: ConnectionCache;
}

let cachedURI: ConnectionCache = global.mongooseURI || {
  conn: null,
  promise: null,
};

if (!global.mongooseURI) {
  global.mongooseURI = { conn: null, promise: null };
  cachedURI = global.mongooseURI;
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cachedURI.conn) return cachedURI.conn;
  if (!cachedURI.promise) {
    const opts = { bufferCommands: false };

    !isDisabled
      ? (cachedURI.promise = mongoose.connect(MONGODB_URI, opts))
      : (cachedURI.promise = Promise.resolve(mongoose));
  }
  try {
    cachedURI.conn = await cachedURI.promise;
    return cachedURI.conn;
  } catch (error) {
    throw error;
  }
}

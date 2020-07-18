import 'https://deno.land/x/denv/mod.ts';

// We need to import denv to get access to .env
const env = Deno.env.toObject();

export const PORT = parseInt(env.PORT, 10) || 5000;
export const MONGO_HOST_URL = env.MONGO_HOST_URL || 'mongodb://localhost:27017';
export const MONGO_DB_NAME = env.MONGO_DB_NAME || 'bookstore';

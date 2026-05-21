import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV || 'development',
  jikan_api_url: process.env.JIKAN_API_URL || 'https://api.jikan.moe/v4',
  consumet_api_url: process.env.CONSUMET_API_URL || 'https://api.consumet.org',
};

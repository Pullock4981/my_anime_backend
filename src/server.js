import mongoose from 'mongoose';
import app from './app.js';
import config from './app/config/index.js';

let server;

async function main() {
  try {
    if (!config.database_url) {
      console.error('✘ Error: MONGO_URI environment variable is missing in .env');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(config.database_url);
    console.log('✔ Database connection established successfully');

    // Start Express Server
    server = app.listen(config.port, () => {
      console.log(`✔ Server is running on port ${config.port} in ${config.node_env} mode`);
    });
  } catch (error) {
    console.error('✘ Server startup failed:', error);
    process.exit(1);
  }
}

main();

// Handle unhandled rejections gracefully
process.on('unhandledRejection', (error) => {
  console.log('😈 unhandledRejection detected! Shutting down server...');
  console.error(error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.log('😈 uncaughtException detected! Shutting down process...');
  console.error(error);
  process.exit(1);
});

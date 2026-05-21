import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import globalErrorHandler from './app/middleware/globalErrorHandler.js';
import notFound from './app/middleware/notFound.js';
import { AnimeRoutes } from './modules/anime/anime.route.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors());

// HTTP Request logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser (parse JSON and URL-encoded requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Anime Streaming API',
  });
});

// Mount application routes
app.use('/api/v1/animes', AnimeRoutes);

// Global Error Handling Middleware (Must be after route definitions)
app.use(globalErrorHandler);

// Catch unmatched / undefined routes (404)
app.use(notFound);

export default app;

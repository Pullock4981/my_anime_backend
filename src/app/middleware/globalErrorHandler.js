import config from '../config/index.js';
import httpStatus from '../constants/httpStatus.js';

const globalErrorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';
  let errorSources = [];

  // 1. Zod Validation Error handler
  if (err.name === 'ZodError' || err.issues) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message,
    }));
  }
  // 2. Mongoose Validation Error handler
  else if (err.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorSources = Object.values(err.errors).map((val) => ({
      path: val.path || '',
      message: val.message,
    }));
  }
  // 3. Mongoose Cast Error handler (invalid ID)
  else if (err.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID';
    errorSources = [
      {
        path: err.path || '',
        message: `${err.value} is not a valid ID`,
      },
    ];
  }
  // 4. Mongoose Duplicate Key Error (code 11000)
  else if (err.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Duplicate key error';
    
    // Extract duplicate field from error message
    const match = err.message.match(/"([^"]*)"/);
    const fieldValue = match ? match[1] : '';
    errorSources = [
      {
        path: Object.keys(err.keyValue || {})[0] || '',
        message: `${fieldValue} already exists`,
      },
    ];
  }
  // 5. Custom AppError handler
  else if (err instanceof Error && err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }
  // 6. Generic Native JS Error handler
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // Send the formatted error response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;

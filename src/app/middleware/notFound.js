import httpStatus from '../constants/httpStatus.js';

const notFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Endpoint Not Found',
    errorSources: [
      {
        path: req.originalUrl,
        message: 'The requested path could not be found',
      },
    ],
  });
};

export default notFound;

import AppError from '../errors/AppError.js';
import httpStatus from '../constants/httpStatus.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Authentication Middleware Boilerplate
 * @param {...string} requiredRoles - Roles allowed to access the route (e.g., 'admin', 'user')
 */
const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check if token is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this resource');
    }

    const token = authHeader.split(' ')[1];

    // 2. JWT Verification (Uncomment and set up config when ready)
    /*
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret);
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
    req.user = decoded;
    */

    // Mock authorized user payload for boilerplate testing:
    req.user = {
      id: 'mock_user_123',
      role: 'admin', // or 'user'
    };

    // 3. Role Authorization check
    if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }

    next();
  });
};

export default auth;

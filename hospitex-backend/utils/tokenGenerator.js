import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * Generate refresh token with longer expiry
 * @param {string} userId - User ID to encode in token
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' }, 
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    return null;
  }
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decode failed:', error.message);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get remaining time of token in seconds
 * @param {string} token - JWT token
 * @returns {number} Remaining time in seconds, -1 if invalid
 */
export const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return -1;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    return -1;
  }
};

/**
 * Generate temporary token for email verification
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} Temporary token
 */
export const generateTempToken = (userId, email) => {
  return jwt.sign(
    { 
      id: userId, 
      email: email,
      type: 'temp',
      purpose: 'verification'
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '1h' // Short expiry for temp tokens
    }
  );
};

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} Password reset token
 */
export const generateResetToken = (userId, email) => {
  return jwt.sign(
    { 
      id: userId, 
      email: email,
      type: 'reset',
      purpose: 'password_reset'
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '1h'
    }
  );
};

/**
 * Generate admin token with additional claims
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} adminLevel - Admin level (State/District)
 * @returns {string} Admin token
 */
export const generateAdminToken = (userId, role, adminLevel) => {
  return jwt.sign(
    { 
      id: userId, 
      role: role,
      adminLevel: adminLevel,
      type: 'admin'
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '7d'
    }
  );
};

/**
 * Generate multiple tokens for different purposes
 * @param {string} userId - User ID
 * @returns {object} Object containing all tokens
 */
export const generateAllTokens = (userId) => {
  return {
    accessToken: generateToken(userId),
    refreshToken: generateRefreshToken(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  };
};

/**
 * Extract token from request headers or cookies
 * @param {object} req - Express request object
 * @returns {string|null} Token or null
 */
export const extractToken = (req) => {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // Check query params (for special cases like email verification)
  if (req.query && req.query.token) {
    return req.query.token;
  }
  
  return null;
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {object|null} New tokens or null if invalid
 */
export const refreshAccessToken = (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.id) {
    return null;
  }
  
  return {
    accessToken: generateToken(decoded.id),
    refreshToken: generateRefreshToken(decoded.id)
  };
};

/**
 * Generate token for service-to-service communication
 * @param {string} serviceName - Service name
 * @returns {string} Service token
 */
export const generateServiceToken = (serviceName) => {
  return jwt.sign(
    { 
      service: serviceName,
      type: 'service',
      timestamp: Date.now()
    }, 
    process.env.JWT_SERVICE_SECRET || process.env.JWT_SECRET, 
    {
      expiresIn: '30d'
    }
  );
};

/**
 * Verify service token
 * @param {string} token - Service token
 * @returns {boolean} True if valid
 */
export const verifyServiceToken = (token) => {
  try {
    const secret = process.env.JWT_SERVICE_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded && decoded.type === 'service';
  } catch (error) {
    return false;
  }
};

// Default export with all functions
export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenRemainingTime,
  generateTempToken,
  generateResetToken,
  generateAdminToken,
  generateAllTokens,
  extractToken,
  refreshAccessToken,
  generateServiceToken,
  verifyServiceToken
};
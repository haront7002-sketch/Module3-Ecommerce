import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secret = process.env.JWT_SECRET || (!isProduction ? 'local-dev-jwt-secret-change-me' : '');

  if (!secret) {
    const err = new Error('Missing JWT_SECRET');
    err.code = 'JWT_CONFIG_MISSING';
    throw err;
  }

  return secret;
};

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = { user_id: decoded.user_id };
    return next();
  } catch (error) {
    if (error?.code === 'JWT_CONFIG_MISSING') {
      return res.status(500).json({ message: 'Server auth configuration missing (JWT_SECRET)' });
    }

    if (error?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    if (error?.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default protect;

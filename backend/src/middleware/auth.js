import jwt from 'jsonwebtoken';
import { memoryStore } from '../services/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rasa_cue_dev_jwt_secret_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }

    const user = memoryStore.findUserById(decoded.id);
    if (!user) {
      // Allow fallback if user is in decoded payload
      req.user = decoded;
    } else {
      req.user = user;
    }
    next();
  });
};

export const requireArtist = (req, res, next) => {
  if (!req.user || req.user.role !== 'artist') {
    return res.status(403).json({
      success: false,
      message: 'Artist access required. This feature is reserved for performance creators.'
    });
  }
  next();
};

export const requireAudience = (req, res, next) => {
  if (!req.user || req.user.role !== 'audience') {
    return res.status(403).json({
      success: false,
      message: 'Audience access required. Please sign in with an audience account.'
    });
  }
  next();
};

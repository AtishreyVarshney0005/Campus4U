import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'college-secret-key');
      const student = decoded.id ? db.prepare('SELECT * FROM students WHERE id = ?').get(decoded.id) : null;
      req.student = student
        ? { _id: student.id, ...student }
        : {
          _id: null,
          email: decoded.email,
          role: decoded.role,
          fullName: decoded.email?.split('@')[0] || decoded.role,
        };

      if (!req.student.email || !req.student.role) {
        return res.status(401).json({ message: 'Student not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;

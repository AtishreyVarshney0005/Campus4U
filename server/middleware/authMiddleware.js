import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const sanitizeStudent = (row) => {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    studentId: row.student_id,
    role: row.role,
    phone: row.phone,
    course: row.course,
    branch: row.branch,
    semester: row.semester,
    year: row.year,
    profileImage: row.profile_image,
    address: row.address,
    dateOfBirth: row.date_of_birth,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'college-secret-key');
    const student = decoded.id ? db.prepare('SELECT * FROM students WHERE id = ?').get(decoded.id) : null;

    if (!student) {
      return res.status(401).json({ message: 'Student not found' });
    }

    req.student = sanitizeStudent(student);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;

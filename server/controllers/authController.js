import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { getDisplayName, isValidEmail, ROLE_PASSWORDS } from '../config/authConfig.js';

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'college-secret-key', {
    expiresIn: '7d',
  });
};

const toStudent = (row, includePassword = false) => {
  if (!row) return null;
  const student = {
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
  if (includePassword) student.password = row.password;
  return student;
};

export const registerStudent = async (req, res) => {
  try {
    const { fullName, email, studentId, password, confirmPassword } = req.body;

    if (!fullName || !email || !studentId || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId.trim().toUpperCase();
    const existingEmail = db.prepare('SELECT id FROM students WHERE email = ?').get(normalizedEmail);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const existingStudentId = db.prepare('SELECT id FROM students WHERE student_id = ?').get(normalizedStudentId);
    if (existingStudentId) {
      return res.status(400).json({ message: 'Student ID already exists.' });
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare(`INSERT INTO students
      (id, full_name, email, student_id, role, password, profile_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'student', ?, ?, ?, ?)`)
      .run(id, fullName.trim(), normalizedEmail, normalizedStudentId, hashedPassword,
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', now, now);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);

    res.status(201).json({
      message: 'Student registered successfully.',
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        studentId: student.student_id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password, role = 'student' } = req.body;

    if (!email || !password || !ROLE_PASSWORDS[role] || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (password !== ROLE_PASSWORDS[role]) {
      return res.status(401).json({
        message: role === 'teacher' ? 'Invalid teacher credentials.' : 'Invalid student credentials.',
      });
    }

    let user = db.prepare('SELECT * FROM students WHERE email = ? AND role = ?').get(email, role);

    if (!user) {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const studentId = `${role === 'teacher' ? 'TCH' : 'STU'}${Date.now()}`;
      const hashedPassword = await bcrypt.hash(ROLE_PASSWORDS[role], 10);

      db.prepare(`INSERT INTO students
        (id, full_name, email, student_id, role, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(id, getDisplayName(email, role), email, studentId, role, hashedPassword, now, now);

      user = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    }

    const token = generateToken(user.id, email, role);

    res.status(200).json({
      token,
      student: toStudent(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.student);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile.' });
  }
};

export const logoutStudent = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

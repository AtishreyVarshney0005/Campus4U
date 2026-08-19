import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'college-secret-key', {
    expiresIn: '7d',
  });
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

    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const existingStudentId = await Student.findOne({ studentId: studentId.toUpperCase() });
    if (existingStudentId) {
      return res.status(400).json({ message: 'Student ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      fullName,
      email: email.toLowerCase(),
      studentId: studentId.toUpperCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Student registered successfully.',
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    const token = generateToken(student._id);

    res.status(200).json({
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        course: student.course,
        branch: student.branch,
        semester: student.semester,
        year: student.year,
        profileImage: student.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile.' });
  }
};

export const logoutStudent = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

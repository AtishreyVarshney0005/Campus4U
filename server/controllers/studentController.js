import { db } from '../config/db.js';

const toStudent = (row) => row && {
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

export const getStudentProfile = async (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.student._id);

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    res.status(200).json(toStudent(student));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      course: req.body.course,
      branch: req.body.branch,
      semester: req.body.semester,
      year: req.body.year,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      profileImage: req.body.profileImage,
    };

    const now = new Date().toISOString();
    db.prepare(`UPDATE students SET full_name = ?, phone = ?, course = ?, branch = ?, semester = ?,
      year = ?, address = ?, date_of_birth = ?, profile_image = ?, updated_at = ? WHERE id = ?`)
      .run(updates.fullName, updates.phone, updates.course, updates.branch, updates.semester,
        updates.year, updates.address, updates.dateOfBirth, updates.profileImage, now, req.student._id);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.student._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json(toStudent(student));
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed.' });
  }
};

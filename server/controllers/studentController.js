import Student from '../models/Student.js';

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    res.status(200).json(student);
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

    const student = await Student.findByIdAndUpdate(req.student._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed.' });
  }
};

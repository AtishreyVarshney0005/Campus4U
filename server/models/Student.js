import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    course: {
      type: String,
      default: 'B.Tech',
    },
    branch: {
      type: String,
      default: 'Computer Science',
    },
    semester: {
      type: Number,
      default: 6,
    },
    year: {
      type: Number,
      default: 2026,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    address: {
      type: String,
      default: '123 Green Park, Bengaluru, India',
    },
    dateOfBirth: {
      type: String,
      default: '2004-08-14',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;

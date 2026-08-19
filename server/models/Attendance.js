import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    totalClasses: {
      type: Number,
      required: true,
    },
    present: {
      type: Number,
      required: true,
    },
    absent: {
      type: Number,
      default: 0,
    },
    leave: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;

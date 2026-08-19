import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema(
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
    internalMarks: {
      type: Number,
      default: 0,
    },
    assignmentMarks: {
      type: Number,
      default: 0,
    },
    practicalMarks: {
      type: Number,
      default: 0,
    },
    theoryMarks: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      default: 'A',
    },
    semester: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;

import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Issued', 'Returned', 'Overdue'],
      default: 'Issued',
    },
  },
  { timestamps: true }
);

const Library = mongoose.model('Library', librarySchema);

export default Library;

import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    driveDate: {
      type: Date,
      required: true,
    },
    studentsApplied: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Placement = mongoose.model('Placement', placementSchema);

export default Placement;

import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Sports', 'Events', 'Placement', 'Announcement'],
      default: 'Announcement',
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

export default News;

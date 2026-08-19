import Attendance from '../models/Attendance.js';
import Marks from '../models/Marks.js';
import Library from '../models/Library.js';
import Placement from '../models/Placement.js';
import News from '../models/News.js';
import Event from '../models/Event.js';

export const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.student._id }).sort({ subject: 1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance.' });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.student._id });

    const totalClasses = records.reduce((sum, item) => sum + item.totalClasses, 0);
    const present = records.reduce((sum, item) => sum + item.present, 0);
    const absent = records.reduce((sum, item) => sum + item.absent, 0);
    const leaves = records.reduce((sum, item) => sum + (item.leave || 0), 0);
    const overall = totalClasses ? Math.round((present / totalClasses) * 100) : 0;

    res.status(200).json({ totalClasses, present, absent, leave: leaves, percentage: overall });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance summary.' });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const records = await Marks.find({ studentId: req.student._id }).sort({ subject: 1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marks.' });
  }
};

export const getMarksSummary = async (req, res) => {
  try {
    const records = await Marks.find({ studentId: req.student._id });
    const total = records.reduce((sum, item) => sum + item.totalMarks, 0);
    const average = records.length ? total / records.length : 0;
    const highest = records.length ? Math.max(...records.map((item) => item.totalMarks)) : 0;
    const lowest = records.length ? Math.min(...records.map((item) => item.totalMarks)) : 0;
    const averagePercentage = records.length ? (average / 100) * 100 : 0;

    res.status(200).json({
      totalMarks: total,
      averageMarks: Number(average.toFixed(2)),
      highestMarks: highest,
      lowestMarks: lowest,
      percentage: Number(averagePercentage.toFixed(2)),
      cgpa: Number((average / 25).toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marks summary.' });
  }
};

export const getLibraryBooks = async (req, res) => {
  try {
    const books = await Library.find({ studentId: req.student._id }).sort({ issueDate: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch library books.' });
  }
};

export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ driveDate: 1 });
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch placements.' });
  }
};

export const applyPlacement = async (req, res) => {
  try {
    const { placementId } = req.body;
    const placement = await Placement.findById(placementId);

    if (!placement) {
      return res.status(404).json({ message: 'Placement not found.' });
    }

    if (!placement.studentsApplied.includes(req.student._id)) {
      placement.studentsApplied.push(req.student._id);
      await placement.save();
    }

    res.status(200).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to apply for placement.' });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news.' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

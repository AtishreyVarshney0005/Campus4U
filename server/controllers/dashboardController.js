import { db } from '../config/db.js';

const mapAttendance = (row) => ({
  _id: row.id,
  id: row.id,
  studentId: row.student_id,
  subject: row.subject,
  totalClasses: row.total_classes,
  present: row.present,
  absent: row.absent,
  leave: row.leave_count,
  percentage: row.percentage,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapMarks = (row) => ({
  _id: row.id,
  id: row.id,
  studentId: row.student_id,
  subject: row.subject,
  internalMarks: row.internal_marks,
  assignmentMarks: row.assignment_marks,
  practicalMarks: row.practical_marks,
  theoryMarks: row.theory_marks,
  totalMarks: row.total_marks,
  grade: row.grade,
  semester: row.semester,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapLibrary = (row) => ({
  _id: row.id,
  id: row.id,
  studentId: row.student_id,
  bookName: row.book_name,
  author: row.author,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  returnDate: row.return_date,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPlacement = (row) => ({
  _id: row.id,
  id: row.id,
  companyName: row.company_name,
  role: row.role,
  package: row.package,
  location: row.location,
  eligibility: row.eligibility,
  driveDate: row.drive_date,
  studentsApplied: db.prepare('SELECT student_id FROM placement_applications WHERE placement_id = ?')
    .all(row.id).map((application) => application.student_id),
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapNews = (row) => ({
  _id: row.id,
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  date: row.date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapEvent = (row) => ({
  _id: row.id,
  id: row.id,
  title: row.title,
  description: row.description,
  date: row.date,
  time: row.time,
  location: row.location,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getStudentAttendance = async (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM attendance WHERE student_id = ? ORDER BY subject ASC')
      .all(req.student._id).map(mapAttendance);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance.' });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const records = db.prepare('SELECT total_classes, present, absent, leave_count FROM attendance WHERE student_id = ?')
      .all(req.student._id);
    const totalClasses = records.reduce((sum, item) => sum + item.total_classes, 0);
    const present = records.reduce((sum, item) => sum + item.present, 0);
    const absent = records.reduce((sum, item) => sum + item.absent, 0);
    const leaves = records.reduce((sum, item) => sum + item.leave_count, 0);
    const percentage = totalClasses ? Math.round((present / totalClasses) * 100) : 0;
    res.status(200).json({ totalClasses, present, absent, leave: leaves, percentage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance summary.' });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM marks WHERE student_id = ? ORDER BY subject ASC')
      .all(req.student._id).map(mapMarks);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marks.' });
  }
};

export const getMarksSummary = async (req, res) => {
  try {
    const records = db.prepare('SELECT total_marks FROM marks WHERE student_id = ?').all(req.student._id);
    const total = records.reduce((sum, item) => sum + item.total_marks, 0);
    const average = records.length ? total / records.length : 0;
    const highest = records.length ? Math.max(...records.map((item) => item.total_marks)) : 0;
    const lowest = records.length ? Math.min(...records.map((item) => item.total_marks)) : 0;
    res.status(200).json({
      totalMarks: total,
      averageMarks: Number(average.toFixed(2)),
      highestMarks: highest,
      lowestMarks: lowest,
      percentage: Number(average.toFixed(2)),
      cgpa: Number((average / 25).toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marks summary.' });
  }
};

export const getLibraryBooks = async (req, res) => {
  try {
    const books = db.prepare('SELECT * FROM library WHERE student_id = ? ORDER BY issue_date DESC')
      .all(req.student._id).map(mapLibrary);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch library books.' });
  }
};

export const getPlacements = async (req, res) => {
  try {
    const placements = db.prepare('SELECT * FROM placements ORDER BY drive_date ASC')
      .all().map(mapPlacement);
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch placements.' });
  }
};

export const applyPlacement = async (req, res) => {
  try {
    const placement = db.prepare('SELECT id FROM placements WHERE id = ?').get(req.body.placementId);
    if (!placement) return res.status(404).json({ message: 'Placement not found.' });

    db.prepare(`INSERT OR IGNORE INTO placement_applications
      (placement_id, student_id, applied_at) VALUES (?, ?, ?)`)
      .run(placement.id, req.student._id, new Date().toISOString());
    res.status(200).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to apply for placement.' });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all().map(mapNews);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news.' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all().map(mapEvent);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

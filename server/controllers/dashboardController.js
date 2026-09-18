import crypto from 'crypto';
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

const buildStudentPerformance = (studentId) => {
  const attendanceRecords = db.prepare(
    'SELECT total_classes, present FROM attendance WHERE student_id = ?'
  ).all(studentId);

  const totalClasses = attendanceRecords.reduce((sum, item) => sum + item.total_classes, 0);
  const presentClasses = attendanceRecords.reduce((sum, item) => sum + item.present, 0);
  const attendanceRate = totalClasses ? Math.round((presentClasses / totalClasses) * 100) : 0;

  const marksRecords = db.prepare('SELECT total_marks FROM marks WHERE student_id = ?').all(studentId);
  const averageMarks = marksRecords.length
    ? marksRecords.reduce((sum, item) => sum + item.total_marks, 0) / marksRecords.length
    : 0;

  return {
    attendanceRate,
    averageMarks: Number(averageMarks.toFixed(1)),
    totalClasses,
  };
};

const getGradeFromMarks = (totalMarks) => {
  if (totalMarks >= 90) return 'A+';
  if (totalMarks >= 80) return 'A';
  if (totalMarks >= 70) return 'B+';
  if (totalMarks >= 60) return 'B';
  if (totalMarks >= 50) return 'C';
  return 'D';
};

export const getTeacherDashboard = async (req, res) => {
  try {
    const students = db.prepare(
      'SELECT * FROM students WHERE role = ? ORDER BY full_name ASC'
    ).all('student');

    const roster = students.map((studentRow) => {
      const { attendanceRate, averageMarks, totalClasses } = buildStudentPerformance(studentRow.id);

      return {
        id: studentRow.id,
        fullName: studentRow.full_name,
        email: studentRow.email,
        studentId: studentRow.student_id,
        role: studentRow.role,
        course: studentRow.course,
        branch: studentRow.branch,
        semester: studentRow.semester,
        year: studentRow.year,
        profileImage: studentRow.profile_image,
        attendanceRate,
        averageMarks,
        totalClasses,
      };
    });

    const activeCourses = new Set(roster.map((item) => item.course).filter(Boolean)).size || 4;
    const pendingReviews = Math.max(8, Math.min(25, Math.round(roster.length * 1.8)));

    res.status(200).json({
      stats: {
        totalStudents: roster.length,
        activeCourses,
        pendingReviews,
        todayClasses: 3,
      },
      schedule: [
        { time: '11:00 AM', title: 'Data Structures', description: 'Second year, Section A · Room 204' },
        { time: '1:30 PM', title: 'Database Systems', description: 'Third year, Section B · Lab 2' },
        { time: '3:00 PM', title: 'Project Guidance', description: 'Final year project review · Faculty Room' },
      ],
      students: roster,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teacher dashboard data.' });
  }
};

export const getTeacherStudents = async (req, res) => {
  try {
    const students = db.prepare(
      'SELECT * FROM students WHERE role = ? ORDER BY full_name ASC'
    ).all('student');

    const roster = students.map((studentRow) => {
      const { attendanceRate, averageMarks, totalClasses } = buildStudentPerformance(studentRow.id);

      return {
        id: studentRow.id,
        fullName: studentRow.full_name,
        email: studentRow.email,
        studentId: studentRow.student_id,
        role: studentRow.role,
        course: studentRow.course,
        branch: studentRow.branch,
        semester: studentRow.semester,
        year: studentRow.year,
        profileImage: studentRow.profile_image,
        attendanceRate,
        averageMarks,
        totalClasses,
      };
    });

    res.status(200).json(roster);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students roster.' });
  }
};

export const updateTeacherAttendance = async (req, res) => {
  try {
    if (req.student.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update attendance.' });
    }

    const { studentId, subject, totalClasses, present, absent, leave = 0 } = req.body;

    if (!studentId || !subject || totalClasses === undefined || present === undefined) {
      return res.status(400).json({ message: 'studentId, subject, totalClasses and present are required.' });
    }

    const student = db.prepare('SELECT id FROM students WHERE id = ? AND role = ?').get(studentId, 'student');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const normalizedTotalClasses = Number(totalClasses);
    const normalizedPresent = Number(present);
    const normalizedAbsent = Number(absent ?? Math.max(0, normalizedTotalClasses - normalizedPresent - Number(leave)));
    const normalizedLeave = Number(leave ?? 0);
    const percentage = normalizedTotalClasses
      ? Number(((normalizedPresent / normalizedTotalClasses) * 100).toFixed(2))
      : 0;

    const trimmedSubject = String(subject).trim();
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT * FROM attendance WHERE student_id = ? AND subject = ?').get(studentId, trimmedSubject);

    if (existing) {
      db.prepare(`UPDATE attendance
        SET total_classes = ?, present = ?, absent = ?, leave_count = ?, percentage = ?, updated_at = ?
        WHERE id = ?`)
        .run(
          normalizedTotalClasses,
          normalizedPresent,
          normalizedAbsent,
          normalizedLeave,
          percentage,
          now,
          existing.id,
        );
    } else {
      db.prepare(`INSERT INTO attendance
        (id, student_id, subject, total_classes, present, absent, leave_count, percentage, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(
          crypto.randomUUID(),
          studentId,
          trimmedSubject,
          normalizedTotalClasses,
          normalizedPresent,
          normalizedAbsent,
          normalizedLeave,
          percentage,
          now,
          now,
        );
    }

    const record = db.prepare('SELECT * FROM attendance WHERE student_id = ? AND subject = ?').get(studentId, trimmedSubject);

    res.status(existing ? 200 : 201).json(mapAttendance(record));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update attendance.' });
  }
};

export const updateTeacherMarks = async (req, res) => {
  try {
    if (req.student.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update marks.' });
    }

    const {
      studentId,
      subject,
      internalMarks = 0,
      assignmentMarks = 0,
      practicalMarks = 0,
      theoryMarks = 0,
      semester = 6,
    } = req.body;

    if (!studentId || !subject) {
      return res.status(400).json({ message: 'studentId and subject are required.' });
    }

    const student = db.prepare('SELECT id FROM students WHERE id = ? AND role = ?').get(studentId, 'student');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const trimmedSubject = String(subject).trim();
    const totalMarks = Number(internalMarks) + Number(assignmentMarks) + Number(practicalMarks) + Number(theoryMarks);
    const grade = getGradeFromMarks(totalMarks);
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT * FROM marks WHERE student_id = ? AND subject = ?').get(studentId, trimmedSubject);

    if (existing) {
      db.prepare(`UPDATE marks
        SET internal_marks = ?, assignment_marks = ?, practical_marks = ?, theory_marks = ?, total_marks = ?, grade = ?, semester = ?, updated_at = ?
        WHERE id = ?`)
        .run(
          Number(internalMarks),
          Number(assignmentMarks),
          Number(practicalMarks),
          Number(theoryMarks),
          totalMarks,
          grade,
          Number(semester),
          now,
          existing.id,
        );
    } else {
      db.prepare(`INSERT INTO marks
        (id, student_id, subject, internal_marks, assignment_marks, practical_marks, theory_marks, total_marks, grade, semester, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(
          crypto.randomUUID(),
          studentId,
          trimmedSubject,
          Number(internalMarks),
          Number(assignmentMarks),
          Number(practicalMarks),
          Number(theoryMarks),
          totalMarks,
          grade,
          Number(semester),
          now,
          now,
        );
    }

    const record = db.prepare('SELECT * FROM marks WHERE student_id = ? AND subject = ?').get(studentId, trimmedSubject);

    res.status(existing ? 200 : 201).json(mapMarks(record));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update marks.' });
  }
};

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

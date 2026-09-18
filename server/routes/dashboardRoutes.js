import express from 'express';
import {
  getTeacherDashboard,
  getTeacherStudents,
  updateTeacherAttendance,
  updateTeacherMarks,
  getStudentAttendance,
  getAttendanceSummary,
  getStudentMarks,
  getMarksSummary,
  getLibraryBooks,
  getPlacements,
  applyPlacement,
  getNews,
  getEvents,
} from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/teacher/dashboard', protect, getTeacherDashboard);
router.get('/teacher/students', protect, getTeacherStudents);
router.post('/teacher/attendance', protect, updateTeacherAttendance);
router.post('/teacher/marks', protect, updateTeacherMarks);
router.get('/attendance', protect, getStudentAttendance);
router.get('/attendance/summary', protect, getAttendanceSummary);
router.get('/marks', protect, getStudentMarks);
router.get('/marks/summary', protect, getMarksSummary);
router.get('/library/books', protect, getLibraryBooks);
router.get('/placements', protect, getPlacements);
router.post('/placements/apply', protect, applyPlacement);
router.get('/news', protect, getNews);
router.get('/events', protect, getEvents);

export default router;

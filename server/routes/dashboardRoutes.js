import express from 'express';
import {
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

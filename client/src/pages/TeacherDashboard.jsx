import { useEffect, useState } from 'react';
import { CalendarDays, FilePenLine, LogOut, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const initialAttendanceForm = {
  studentId: '',
  subject: 'Computer Science',
  totalClasses: 25,
  present: 23,
  absent: 1,
  leave: 1,
};

const initialMarksForm = {
  studentId: '',
  subject: 'Computer Science',
  internalMarks: 18,
  assignmentMarks: 9,
  practicalMarks: 18,
  theoryMarks: 35,
  semester: 6,
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [dashboard, setDashboard] = useState({
    stats: { totalStudents: 0, activeCourses: 0, pendingReviews: 0, todayClasses: 0 },
    schedule: [],
    students: [],
  });
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState('attendance');
  const [attendanceForm, setAttendanceForm] = useState(initialAttendanceForm);
  const [marksForm, setMarksForm] = useState(initialMarksForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await API.get('/teacher/dashboard');
      setDashboard(response.data);
      if (response.data.students.length) {
        setAttendanceForm((prev) => ({ ...prev, studentId: prev.studentId || response.data.students[0].id }));
        setMarksForm((prev) => ({ ...prev, studentId: prev.studentId || response.data.students[0].id }));
      }
    } catch (error) {
      console.error('Teacher dashboard fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login/teacher');
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.post('/teacher/attendance', attendanceForm);
      alert('Attendance updated successfully.');
      await fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarksSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.post('/teacher/marks', marksForm);
      alert('Marks updated successfully.');
      await fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update marks.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="main-panel">
        <Navbar onToggleSidebar={() => {}} />

        <main className="content-area">
          <div className="page-header">
            <div>
              <p className="eyebrow">Faculty workspace</p>
              <h2>Welcome back, {student?.fullName?.split(' ')[0] || 'Teacher'}!</h2>
              <p className="page-subtitle">{student?.email} · Manage your classes, students, and academic work from here.</p>
            </div>
            <button className="primary-btn small" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {loading ? (
            <div className="loading-state">Loading teacher dashboard...</div>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard title="My Students" value={String(dashboard.stats.totalStudents)} subtitle="Across active classes" tone="primary" />
                <StatCard title="Active Courses" value={String(dashboard.stats.activeCourses)} subtitle="This semester" tone="success" />
                <StatCard title="Pending Reviews" value={String(dashboard.stats.pendingReviews)} subtitle="Assignments to check" tone="warning" />
                <StatCard title="Today's Classes" value={String(dashboard.stats.todayClasses)} subtitle="Next class at 11:00 AM" tone="info" />
              </div>

              <div className="widgets-grid">
                <section className="panel-card span-2">
                  <div className="panel-head">
                    <div className="panel-title-wrap"><CalendarDays size={18} /><h3>Today's Schedule</h3></div>
                  </div>
                  <div className="news-list">
                    {dashboard.schedule.map((item) => (
                      <div className="news-item" key={`${item.time}-${item.title}`}>
                        <div className="chip">{item.time}</div>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel-card">
                  <div className="panel-head">
                    <div className="panel-title-wrap"><FilePenLine size={18} /><h3>Quick Actions</h3></div>
                  </div>
                  <div className="teacher-actions">
                    <button
                      className={`primary-btn ${activePanel === 'attendance' ? 'active-panel' : ''}`}
                      type="button"
                      onClick={() => setActivePanel('attendance')}
                    >
                      Mark Attendance
                    </button>
                    <button
                      className={`secondary-btn ${activePanel === 'marks' ? 'active-panel' : ''}`}
                      type="button"
                      onClick={() => setActivePanel('marks')}
                    >
                      Upload Marks
                    </button>
                    <button className="secondary-btn" type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                      View Students
                    </button>
                  </div>
                </section>
              </div>

              {activePanel === 'attendance' ? (
                <section className="panel-card teacher-form-panel">
                  <div className="panel-head">
                    <div className="panel-title-wrap"><CalendarDays size={18} /><h3>Update Attendance</h3></div>
                  </div>

                  <form className="teacher-form" onSubmit={handleAttendanceSubmit}>
                    <div className="teacher-form-grid">
                      <label className="teacher-field">
                        <span>Student</span>
                        <select
                          value={attendanceForm.studentId}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, studentId: e.target.value }))}
                        >
                          {dashboard.students.map((item) => (
                            <option key={item.id} value={item.id}>{item.fullName} ({item.studentId})</option>
                          ))}
                        </select>
                      </label>

                      <label className="teacher-field">
                        <span>Subject</span>
                        <input
                          type="text"
                          value={attendanceForm.subject}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, subject: e.target.value }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Total Classes</span>
                        <input
                          type="number"
                          min="0"
                          value={attendanceForm.totalClasses}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, totalClasses: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Present</span>
                        <input
                          type="number"
                          min="0"
                          value={attendanceForm.present}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, present: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Absent</span>
                        <input
                          type="number"
                          min="0"
                          value={attendanceForm.absent}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, absent: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Leave</span>
                        <input
                          type="number"
                          min="0"
                          value={attendanceForm.leave}
                          onChange={(e) => setAttendanceForm((prev) => ({ ...prev, leave: Number(e.target.value) }))}
                        />
                      </label>
                    </div>

                    <div className="teacher-form-actions">
                      <button className="primary-btn" type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Attendance'}
                      </button>
                    </div>
                  </form>
                </section>
              ) : (
                <section className="panel-card teacher-form-panel">
                  <div className="panel-head">
                    <div className="panel-title-wrap"><FilePenLine size={18} /><h3>Upload Marks</h3></div>
                  </div>

                  <form className="teacher-form" onSubmit={handleMarksSubmit}>
                    <div className="teacher-form-grid">
                      <label className="teacher-field">
                        <span>Student</span>
                        <select
                          value={marksForm.studentId}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, studentId: e.target.value }))}
                        >
                          {dashboard.students.map((item) => (
                            <option key={item.id} value={item.id}>{item.fullName} ({item.studentId})</option>
                          ))}
                        </select>
                      </label>

                      <label className="teacher-field">
                        <span>Subject</span>
                        <input
                          type="text"
                          value={marksForm.subject}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, subject: e.target.value }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Internal</span>
                        <input
                          type="number"
                          min="0"
                          value={marksForm.internalMarks}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, internalMarks: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Assignment</span>
                        <input
                          type="number"
                          min="0"
                          value={marksForm.assignmentMarks}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, assignmentMarks: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Practical</span>
                        <input
                          type="number"
                          min="0"
                          value={marksForm.practicalMarks}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, practicalMarks: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Theory</span>
                        <input
                          type="number"
                          min="0"
                          value={marksForm.theoryMarks}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, theoryMarks: Number(e.target.value) }))}
                        />
                      </label>

                      <label className="teacher-field">
                        <span>Semester</span>
                        <input
                          type="number"
                          min="1"
                          value={marksForm.semester}
                          onChange={(e) => setMarksForm((prev) => ({ ...prev, semester: Number(e.target.value) }))}
                        />
                      </label>
                    </div>

                    <div className="teacher-form-actions">
                      <button className="primary-btn" type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Marks'}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              <section className="panel-card teacher-roster-panel">
                <div className="panel-head">
                  <div className="panel-title-wrap"><UserRound size={18} /><h3>Student Roster</h3></div>
                </div>
                <div className="teacher-students-list">
                  {dashboard.students.map((studentItem) => (
                    <div className="teacher-student-row" key={studentItem.id}>
                      <img src={studentItem.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'} alt={studentItem.fullName} />
                      <div className="teacher-student-meta">
                        <strong>{studentItem.fullName}</strong>
                        <span>{studentItem.studentId} · {studentItem.course}</span>
                      </div>
                      <div className="teacher-student-metric">
                        <label>Attendance</label>
                        <strong>{studentItem.attendanceRate}%</strong>
                      </div>
                      <div className="teacher-student-metric">
                        <label>Average</label>
                        <strong>{studentItem.averageMarks}</strong>
                      </div>
                      <div className="teacher-student-metric">
                        <label>Semester</label>
                        <strong>{studentItem.semester}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

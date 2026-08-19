import { CalendarDays, FilePenLine, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login/teacher');
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

          <div className="stats-grid">
            <StatCard title="My Students" value="120" subtitle="Across active classes" tone="primary" />
            <StatCard title="Active Courses" value="4" subtitle="This semester" tone="success" />
            <StatCard title="Pending Reviews" value="18" subtitle="Assignments to check" tone="warning" />
            <StatCard title="Today's Classes" value="3" subtitle="Next class at 11:00 AM" tone="info" />
          </div>

          <div className="widgets-grid">
            <section className="panel-card span-2">
              <div className="panel-head">
                <div className="panel-title-wrap"><CalendarDays size={18} /><h3>Today's Schedule</h3></div>
              </div>
              <div className="news-list">
                <div className="news-item"><div className="chip">11:00 AM</div><div><h4>Data Structures</h4><p>Second year, Section A · Room 204</p></div></div>
                <div className="news-item"><div className="chip">1:30 PM</div><div><h4>Database Systems</h4><p>Third year, Section B · Lab 2</p></div></div>
                <div className="news-item"><div className="chip">3:00 PM</div><div><h4>Project Guidance</h4><p>Final year project review · Faculty Room</p></div></div>
              </div>
            </section>

            <section className="panel-card">
              <div className="panel-head">
                <div className="panel-title-wrap"><FilePenLine size={18} /><h3>Quick Actions</h3></div>
              </div>
              <div className="teacher-actions">
                <button className="primary-btn" type="button">Mark Attendance</button>
                <button className="secondary-btn" type="button">Upload Marks</button>
                <button className="secondary-btn" type="button">View Students</button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

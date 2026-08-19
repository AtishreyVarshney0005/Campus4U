import { useEffect, useState } from 'react';
import { BellRing, FileText, BookOpen, BriefcaseBusiness, Newspaper, CalendarDays, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { student } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [library, setLibrary] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({ percentage: 0, present: 0, totalClasses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [attendanceRes, summaryRes, marksRes, libraryRes, placementsRes, newsRes, eventsRes] = await Promise.all([
          API.get('/attendance'),
          API.get('/attendance/summary'),
          API.get('/marks'),
          API.get('/library/books'),
          API.get('/placements'),
          API.get('/news'),
          API.get('/events'),
        ]);

        setAttendance(attendanceRes.data);
        setSummary(summaryRes.data);
        setMarks(marksRes.data);
        setLibrary(libraryRes.data);
        setPlacements(placementsRes.data);
        setNews(newsRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Dashboard fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const averageMarks = marks.length ? (marks.reduce((sum, item) => sum + item.totalMarks, 0) / marks.length).toFixed(1) : '0.0';
  const highestMark = marks.length ? Math.max(...marks.map((m) => m.totalMarks)) : 0;
  const lowestMark = marks.length ? Math.min(...marks.map((m) => m.totalMarks)) : 0;

  const attendanceStatus = summary.percentage >= 75 ? 'Good' : summary.percentage >= 60 ? 'Warning' : 'Critical';

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-panel">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="content-area">
          <div className="page-header">
            <div>
              <p className="eyebrow">Overview</p>
              <h2>Welcome back, {student?.fullName?.split(' ')[0] || 'Student'}!</h2>
              <p className="page-subtitle">{student?.email}</p>
            </div>
            <button className="primary-btn small">View report</button>
          </div>

          {loading ? (
            <div className="loading-state">Loading dashboard data...</div>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard title="Attendance" value={`${summary.percentage || 0}%`} subtitle={`${summary.present || 0} / ${summary.totalClasses || 0} classes`} tone="primary" />
                <StatCard title="Average Marks" value={`${averageMarks}`} subtitle="Across all subjects" tone="success" />
                <StatCard title="Books Issued" value={`${library.filter((item) => item.status === 'Issued').length}`} subtitle={`${library.length} total records`} tone="warning" />
                <StatCard title="Interviews" value={`${placements.length || 0}`} subtitle="Upcoming drives" tone="info" />
              </div>

              <div className="widgets-grid">
                <section className="panel-card span-2">
                  <div className="panel-head">
                    <div className="panel-title-wrap">
                      <CalendarDays size={18} />
                      <h3>Attendance</h3>
                    </div>
                    <span className={`status-pill ${attendanceStatus.toLowerCase()}`}>{attendanceStatus}</span>
                  </div>
                  <div className="attendance-summary">
                    <div>
                      <div className="summary-value">{summary.percentage || 0}%</div>
                      <div className="summary-label">Present</div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${summary.percentage || 0}%` }} />
                    </div>
                    <div className="summary-meta">{summary.present || 0} / {summary.totalClasses || 0} Classes</div>
                  </div>
                </section>

                <section className="panel-card">
                  <div className="panel-head">
                    <div className="panel-title-wrap">
                      <FileText size={18} />
                      <h3>Latest Marks</h3>
                    </div>
                  </div>
                  <div className="marks-list">
                    {marks.slice(0, 4).map((mark) => (
                      <div key={mark.subject} className="mark-row">
                        <span>{mark.subject}</span>
                        <strong>{mark.totalMarks}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="metric-row">
                    <div><span>Average</span><strong>{averageMarks}</strong></div>
                    <div><span>Highest</span><strong>{highestMark}</strong></div>
                    <div><span>Lowest</span><strong>{lowestMark}</strong></div>
                  </div>
                </section>

                <section className="panel-card">
                  <div className="panel-head">
                    <div className="panel-title-wrap">
                      <BookOpen size={18} />
                      <h3>Library</h3>
                    </div>
                  </div>
                  <div className="library-box">
                    <div className="big-number">{library.filter((item) => item.status === 'Issued').length}</div>
                    <div className="summary-label">Books Issued</div>
                    <div className="summary-meta">Due: {library[0]?.dueDate ? new Date(library[0].dueDate).toLocaleDateString('en-GB') : 'N/A'}</div>
                  </div>
                </section>

                <section className="panel-card">
                  <div className="panel-head">
                    <div className="panel-title-wrap">
                      <BriefcaseBusiness size={18} />
                      <h3>Placements</h3>
                    </div>
                  </div>
                  <div className="placement-box">
                    <div className="big-number">{placements.length}</div>
                    <div className="summary-label">Interviews Scheduled</div>
                    <div className="company-list">
                      {placements.slice(0, 3).map((item) => (
                        <span key={item.companyName}>{item.companyName}</span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="panel-card span-2">
                  <div className="panel-head">
                    <div className="panel-title-wrap">
                      <Newspaper size={18} />
                      <h3>College News</h3>
                    </div>
                  </div>
                  <div className="news-list">
                    {news.slice(0, 4).map((item) => (
                      <div className="news-item" key={item.title}>
                        <div className="chip">{item.category}</div>
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
                    <div className="panel-title-wrap">
                      <BellRing size={18} />
                      <h3>Upcoming Events</h3>
                    </div>
                  </div>
                  <div className="events-list">
                    {events.slice(0, 3).map((event) => (
                      <div className="event-item" key={event.title}>
                        <div className="event-date">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        <div>
                          <h4>{event.title}</h4>
                          <p>{event.time}</p>
                          <small>{event.location}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

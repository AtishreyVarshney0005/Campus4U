import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Attendance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ percentage: 0, totalClasses: 0, present: 0, absent: 0, leave: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, summaryRes] = await Promise.all([
          API.get('/attendance'),
          API.get('/attendance/summary'),
        ]);
        setRecords(recordsRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Attendance fetch failed', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-panel">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">
          <div className="page-header page-header-inline">
            <div>
              <p className="eyebrow">Academic</p>
              <h2>Attendance</h2>
            </div>
          </div>

          <div className="summary-grid small-gap">
            <div className="mini-stat">
              <span>Overall Attendance</span>
              <strong>{summary.percentage}%</strong>
            </div>
            <div className="mini-stat">
              <span>Total Classes</span>
              <strong>{summary.totalClasses}</strong>
            </div>
            <div className="mini-stat">
              <span>Present</span>
              <strong>{summary.present}</strong>
            </div>
            <div className="mini-stat">
              <span>Absent</span>
              <strong>{summary.absent}</strong>
            </div>
            <div className="mini-stat">
              <span>Leave</span>
              <strong>{summary.leave}</strong>
            </div>
          </div>

          <section className="panel-card table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Total Classes</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => (
                    <tr key={item.subject}>
                      <td>{item.subject}</td>
                      <td>{item.totalClasses}</td>
                      <td>{item.present}</td>
                      <td>{item.absent}</td>
                      <td>
                        <div className="table-progress">
                          <div className="progress-bar small" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <span>{item.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Attendance;

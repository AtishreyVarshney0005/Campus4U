import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Marks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ percentage: 0, cgpa: 0, averageMarks: 0, highestMarks: 0, lowestMarks: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, summaryRes] = await Promise.all([
          API.get('/marks'),
          API.get('/marks/summary'),
        ]);
        setRecords(recordsRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Marks fetch failed', error);
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
              <p className="eyebrow">Academics</p>
              <h2>Marks</h2>
            </div>
          </div>

          <div className="summary-grid small-gap">
            <div className="mini-stat">
              <span>Overall %</span>
              <strong>{summary.percentage}%</strong>
            </div>
            <div className="mini-stat">
              <span>CGPA</span>
              <strong>{summary.cgpa}</strong>
            </div>
            <div className="mini-stat">
              <span>Highest</span>
              <strong>{summary.highestMarks}</strong>
            </div>
            <div className="mini-stat">
              <span>Lowest</span>
              <strong>{summary.lowestMarks}</strong>
            </div>
          </div>

          <section className="panel-card table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Subject</th>
                    <th>Internal</th>
                    <th>Assignment</th>
                    <th>Practical</th>
                    <th>Theory</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => (
                    <tr key={item.subject}>
                      <td>{item.semester}</td>
                      <td>{item.subject}</td>
                      <td>{item.internalMarks}</td>
                      <td>{item.assignmentMarks}</td>
                      <td>{item.practicalMarks}</td>
                      <td>{item.theoryMarks}</td>
                      <td>{item.totalMarks}</td>
                      <td>{item.grade}</td>
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

export default Marks;

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Placements = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await API.get('/placements');
        setPlacements(response.data);
      } catch (error) {
        console.error('Placements fetch failed', error);
      }
    };

    fetchPlacements();
  }, []);

  const handleApply = async (placementId) => {
    try {
      await API.post('/placements/apply', { placementId });
      alert('Application submitted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply.');
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-panel">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">
          <div className="page-header page-header-inline">
            <div>
              <p className="eyebrow">Career</p>
              <h2>Placements</h2>
            </div>
          </div>

          <div className="placement-grid">
            {placements.map((item) => (
              <div className="placement-card" key={item._id}>
                <div className="placement-top">
                  <div>
                    <h3>{item.companyName}</h3>
                    <span>{item.role}</span>
                  </div>
                  <span className="tag">{item.package}</span>
                </div>
                <div className="placement-meta">
                  <span>{item.location}</span>
                  <span>{new Date(item.driveDate).toLocaleDateString('en-GB')}</span>
                </div>
                <p>{item.eligibility}</p>
                <button className="primary-btn small" onClick={() => handleApply(item._id)}>
                  Apply
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Placements;

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { student } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(student || {});
  const [formData, setFormData] = useState(student || {});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!student?.id) return;
      try {
        const response = await API.get('/student/profile');
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Profile fetch failed', error);
      }
    };

    fetchProfile();
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/student/profile', formData);
      setProfile(response.data);
      alert('Profile updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
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
              <p className="eyebrow">Profile</p>
              <h2>Student Information</h2>
            </div>
          </div>

          <section className="panel-card profile-layout">
            <div className="profile-identity">
              <img src={profile.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'} alt="Student" />
              <h3>{profile.fullName}</h3>
              <p>{profile.studentId}</p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label><span>Full Name</span><input name="fullName" value={formData.fullName || ''} onChange={handleChange} /></label>
                <label><span>Email</span><input name="email" value={formData.email || ''} onChange={handleChange} disabled /></label>
                <label><span>Student ID</span><input name="studentId" value={formData.studentId || ''} onChange={handleChange} disabled /></label>
                <label><span>Phone</span><input name="phone" value={formData.phone || ''} onChange={handleChange} /></label>
                <label><span>Course</span><input name="course" value={formData.course || ''} onChange={handleChange} /></label>
                <label><span>Branch</span><input name="branch" value={formData.branch || ''} onChange={handleChange} /></label>
                <label><span>Semester</span><input name="semester" type="number" value={formData.semester || ''} onChange={handleChange} /></label>
                <label><span>Year</span><input name="year" type="number" value={formData.year || ''} onChange={handleChange} /></label>
                <label><span>Date of Birth</span><input name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} /></label>
                <label className="full-width"><span>Address</span><input name="address" value={formData.address || ''} onChange={handleChange} /></label>
              </div>
              <button type="submit" className="primary-btn">Save Changes</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;

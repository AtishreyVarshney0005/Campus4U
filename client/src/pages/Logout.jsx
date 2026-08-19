import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card logout-card">
        <h2>Are you sure you want to logout?</h2>
        <div className="logout-actions">
          <button className="primary-btn" onClick={handleLogout}>Logout</button>
          <button className="secondary-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;

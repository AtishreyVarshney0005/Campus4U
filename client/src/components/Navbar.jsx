import { Bell, MessageSquare, User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const logoImage = new URL('../../Campus4U Logo.png', import.meta.url).href;

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">☰</button>
        <div className="brand-inline">
          <img src={logoImage} alt="Campus4U" className="brand-logo" />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
        <button className="icon-button" aria-label="Messages"><MessageSquare size={18} /></button>
        <div className="user-chip">
          <div className="avatar-mini">
            <User size={16} />
          </div>
          <span>{student?.fullName || 'Student'}</span>
          <ChevronDown size={16} />
        </div>
        <button className="logout-mini" onClick={handleLogout} aria-label="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

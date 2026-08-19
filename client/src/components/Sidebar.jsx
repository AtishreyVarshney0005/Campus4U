import { LayoutDashboard, CalendarCheck2, FileText, BookOpen, BriefcaseBusiness, Newspaper, UserCircle, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const logoImage = new URL('../../Campus4U Logo.png', import.meta.url).href;

const menuItems = [
  { title: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { title: 'Attendance', to: '/attendance', icon: CalendarCheck2 },
  { title: 'Marks', to: '/marks', icon: FileText },
  { title: 'Library', to: '/library', icon: BookOpen },
  { title: 'Placements', to: '/placements', icon: BriefcaseBusiness },
  { title: 'News', to: '/news', icon: Newspaper },
  { title: 'Profile', to: '/profile', icon: UserCircle },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src={logoImage} alt="Campus4U" className="brand-logo-sidebar" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ title, to, icon: Icon }) => (
          <NavLink
            key={title}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{title}</span>
          </NavLink>
        ))}

        <button className="nav-item logout-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;

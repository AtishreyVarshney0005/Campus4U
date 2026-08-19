import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Library from './pages/Library';
import Placements from './pages/Placements';
import News from './pages/News';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import BirdAnimation from './components/BirdAnimation';

function App() {
  return (
    <>
      <BirdAnimation />
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Navigate to="/login/student" replace />} />
        <Route path="/login/student" element={<Login role="student" />} />
        <Route path="/login/teacher" element={<Login role="teacher" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/placements" element={<ProtectedRoute><Placements /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Router>
    </>
  );
}

export default App;

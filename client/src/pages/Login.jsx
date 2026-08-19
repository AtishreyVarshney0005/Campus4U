import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/modern-login.css';

const logoImage = new URL('../../Campus4U Logo.png', import.meta.url).href;

const Login = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'teacher') {
      setError('Teacher login is not available yet. Please use student login.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.student, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Left Side - Login Form */}
      <div className="login-form-section">
        {/* Role Selection */}
        <div className="role-selection-section">
              <label className="role-label">Login As</label>
              <div className="role-options">
                <div
                  className={`role-card ${role === 'student' ? 'active' : ''}`}
                  onClick={() => navigate('/login/student')}
                >
                  <div className="role-radio">
                    <input
                      type="radio"
                      id="role-student"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => navigate('/login/student')}
                    />
                    <label htmlFor="role-student" className="radio-label"></label>
                  </div>
                  <span className="role-text">Student</span>
                </div>

                <div
                  className={`role-card ${role === 'teacher' ? 'active' : ''}`}
                  onClick={() => navigate('/login/teacher')}
                >
                  <div className="role-radio">
                    <input
                      type="radio"
                      id="role-teacher"
                      name="role"
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={() => navigate('/login/teacher')}
                    />
                    <label htmlFor="role-teacher" className="radio-label"></label>
                  </div>
                  <span className="role-text">Teacher</span>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="welcome-message">
              <h2 className="welcome-title">
                {role === 'student' ? 'Welcome Back, Student!' : 'Welcome Back, Teacher!'}
              </h2>
              <p className="welcome-subtitle">
                {role === 'student'
                  ? 'Login to access your student dashboard'
                  : 'Login to access your teacher dashboard'}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="modern-auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {role === 'student' ? 'Email / Student ID' : 'Email / Teacher ID'}
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 8l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 12 9 22 15 22 15 12"></polyline>
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={
                      role === 'student' ? 'student@abccollege.com' : 'teacher@abccollege.com'
                    }
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <a href="#" className="forgot-password-link">
                    Forgot Password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-4.5-11-4.5s1.6-3.1 4.4-5.4M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 4.5 11 4.5s-1.6 3.1-4.4 5.4m2.76 2.76L2 2"></path>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <div className="form-error-message">{error}</div>}

              <button
                type="submit"
                className={`login-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
        </div>

        {/* Right Side - Illustration */}
      <div className="login-illustration-section">
        <div className="illustration-container">
          <img 
            src={logoImage}
            alt="Campus4U Logo" 
            className="illustration"
          />
          <div className="pattern-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

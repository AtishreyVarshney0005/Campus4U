import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, IdCard, Lock } from 'lucide-react';
import API from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card signup-card">
        <div className="auth-brand">
          <div className="brand-logo">A</div>
          <div>
            <div className="brand-name">ABC College</div>
            <div className="brand-subtitle">Student Registration</div>
          </div>
        </div>

        <h1>Create Account</h1>

        {error && <div className="form-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-wrap">
            <User size={18} />
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="input-wrap">
            <Mail size={18} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-wrap">
            <IdCard size={18} />
            <input type="text" name="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} required />
          </div>

          <div className="input-wrap">
            <Lock size={18} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-wrap">
            <Lock size={18} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="bottom-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

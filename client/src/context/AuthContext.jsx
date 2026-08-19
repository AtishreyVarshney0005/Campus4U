import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('collegeToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        setStudent(response.data);
      } catch (error) {
        localStorage.removeItem('collegeToken');
        setToken(null);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    syncAuth();
  }, [token]);

  const login = (studentData, authToken) => {
    localStorage.setItem('collegeToken', authToken);
    setToken(authToken);
    setStudent(studentData);
  };

  const logout = () => {
    localStorage.removeItem('collegeToken');
    setToken(null);
    setStudent(null);
  };

  const value = useMemo(
    () => ({ student, token, loading, login, logout, setStudent }),
    [student, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

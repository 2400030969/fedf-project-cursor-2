import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PublicPortfolio from './components/Public/PublicPortfolio';
import { getCurrentUser, setCurrentUser } from './utils/storage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/student" /> : <Register onLogin={handleLogin} />} 
        />
        <Route 
          path="/student" 
          element={user && user.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/portfolio/:id" 
          element={<PublicPortfolio />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;


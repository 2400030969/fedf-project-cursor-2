import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../../utils/storage';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = getUserByEmail(email);
    
    if (!user) {
      setError('User not found');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password');
      return;
    }

    onLogin(user);
    navigate(user.role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>EduPort</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p><strong>Student:</strong> student1@edu.com / student123</p>
          <p><strong>Admin:</strong> admin@edu.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


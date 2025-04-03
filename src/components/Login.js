import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../components/auth.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, 
        { email, password }, 
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Success:", response.data); // ✅ Debugging log

      login(response.data);  
      navigate('/properties');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">USER LOGIN</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="input-group">
          <span className="icon">👤</span>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="auth-input"
          />
        </div>
        
        <div className="input-group">
          <span className="icon">🔒</span>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="auth-input"
          />
        </div>

        <div className="options">
          <label className="remember-me">
            <input type="checkbox" /> Remember
          </label>
          <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
        </div>

        <button type="submit" className="auth-button">LOGIN</button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup" className="switch-link">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

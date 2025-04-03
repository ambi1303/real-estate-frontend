import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../components/auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [message, setMessage] = useState(''); 

  const navigate = useNavigate();

  // ✅ Check if API Base URL is correct
  console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, 
        { name, email, password, role }, 
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup Response:", response.data); // ✅ Debugging log

      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">USER SIGNUP</h2>
      {message && <p className="auth-message">{message}</p>}
      
      <form onSubmit={handleSignup} className="auth-form">
        <div className="input-group">
          <span className="icon">👤</span>
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <span className="icon">📧</span>
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

        <select value={role} onChange={(e) => setRole(e.target.value)} required className="auth-dropdown">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="auth-button">SIGNUP</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="switch-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

import { useState, useContext } from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext); // Ensure this is correctly destructured
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data);  // Ensure `login` function exists
      navigate('/properties');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

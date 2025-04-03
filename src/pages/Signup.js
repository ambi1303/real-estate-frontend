import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/signup", { email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Email already registered. Try logging in.");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

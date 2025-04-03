import React, { useState } from "react";
import api from "../services/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password });
      alert("Signup Successful! Please Login.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Signup failed:", error.response.data);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;

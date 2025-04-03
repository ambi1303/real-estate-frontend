import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyList from "./components/PropertyList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

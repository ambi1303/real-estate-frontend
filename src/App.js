import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <div>
        <h1>Real Estate App</h1>
        <Login />
        <Signup />
        <Dashboard />
      </div>
    </AuthProvider>
  );
};

export default App;

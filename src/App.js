import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; 
import Login from "./components/Login";
import Signup from "./components/Signup";
import PropertyPage from "./components/PropertyPage";
import Home from "./pages/Home";

const App = () => {
    const { user } = useContext(AuthContext); // Get authentication status

    return (
        <Router>
            <Routes>
                {/* Redirect to Home if authenticated, else Login */}
                <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/properties" element={user ? <PropertyPage /> : <Navigate to="/login" />} />
                
                {/* Catch all unmatched routes and redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;

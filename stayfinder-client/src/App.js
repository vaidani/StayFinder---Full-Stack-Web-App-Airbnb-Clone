import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListingDetail from "./pages/ListingDetail"; // ✅ New import

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-500">Home</Link>
          <Link to="/register" className="mr-4 text-blue-500">Register</Link>
          <Link to="/login" className="mr-4 text-blue-500">Login</Link>
          <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings/:id" element={<ListingDetail />} /> {/* ✅ New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;







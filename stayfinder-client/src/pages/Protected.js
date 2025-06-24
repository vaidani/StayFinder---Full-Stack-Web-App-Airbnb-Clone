import React, { useState } from "react";
import axios from "axios";

function Protected() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleAccessProtectedRoute = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ No token found. Please login first.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error accessing protected route:", err);
      setMessage("❌ Access denied. Invalid or expired token.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Protected Route</h2>
      <button
        onClick={handleAccessProtectedRoute}
        className="bg-green-500 text-white px-4 py-2 rounded shadow"
      >
        Access Protected Route
      </button>

      {message && (
        <p className="mt-4 text-lg text-center">
          {message}
          {user && (
            <div className="mt-2 text-sm text-gray-700">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Issued at:</strong> {new Date(user.iat * 1000).toLocaleString()}</p>
              <p><strong>Expires at:</strong> {new Date(user.exp * 1000).toLocaleString()}</p>
            </div>
          )}
        </p>
      )}
    </div>
  );
}

export default Protected;

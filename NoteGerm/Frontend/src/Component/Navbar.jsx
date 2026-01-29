import React from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode"; // make sure it's default import

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ✅ declare variable outside if
  let nameLogin = "User";

  if (token) {
    const decode = jwt_decode(token); // decode token
    nameLogin = decode.name ? decode.name : "User"; // set name if exists
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-900 text-white shadow-md">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center font-bold">
            {nameLogin[0]}
          </div>
          <span className="text-lg font-semibold">{nameLogin}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

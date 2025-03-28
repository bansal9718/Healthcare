import { jwtDecode } from "jwt-decode";
import React from "react";

import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const decoded = jwtDecode(token);
      if (decoded.isAdmin) navigate("/adminDashBoard");
      else navigate("/userDashboard");
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/");
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between h-16">
          {/* Left-aligned Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none"
            >
              <img
                src="/A_professional_logo_for_'Advance_Care_Clinic'_feat.png"
                alt="Clinic Logo"
                className="h-12 w-12 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105"
              />
            </button>
          </div>

          {/* Center-aligned Title (absolute positioning) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3">
              <FaHeartbeat className="h-6 w-6 text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />
              <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-white tracking-tight whitespace-nowrap">
                Advanced Cardiac Care
              </h1>
            </div>
          </div>

          {/* Right-aligned Doctor Info */}
          <div className="flex-shrink-0 ml-auto">
            <div className="text-right">
              <p className="text-sm md:text-base font-semibold text-blue-700 dark:text-blue-400 leading-tight">
                Dr. Dhara Singh
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                MBBS, MD (Medicine), DM (Cardiology)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Consultant Cardiologist
              </p>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mt-1">
                <span className="font-normal">Contact:</span> +1 234 5678
              </p>
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-23"></div> {/* Spacer for fixed navbar */}
    </div>
  );
};

export default Navbar;

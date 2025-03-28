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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex flex-wrap items-center justify-between h-auto py-2 sm:py-3">
        {/* Left: Logo */}
        <div className="flex items-center">
          <button onClick={handleLogoClick} className="focus:outline-none">
            <img
              src="/A_professional_logo_for_'Advance_Care_Clinic'_feat.png"
              alt="Clinic Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-md transition-transform duration-300 hover:scale-105"
            />
          </button>
        </div>

        {/* Center: Title (Stacked on Mobile) */}
        <div className="flex flex-col items-center flex-1 text-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FaHeartbeat className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-base sm:text-lg md:text-2xl font-bold text-blue-900 dark:text-white tracking-tight">
              Advanced Cardiac Care
            </h1>
          </div>

          {/* Doctor Info (Visible on Small Screens) */}
          <div className="block sm:hidden mt-1">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Dr. Dhara Singh
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-300">
              MBBS, MD (Medicine), DM (Cardiology)
            </p>
          </div>
        </div>

        {/* Right: Doctor Info (Hidden on Small Screens) */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
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
    </nav>
  );
};

export default Navbar;

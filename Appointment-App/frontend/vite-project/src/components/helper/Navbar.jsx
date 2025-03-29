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
    <div className="mb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md px-4 py-3 border-b border-blue-100 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Enhanced Logo Section */}
          <button
            onClick={handleLogoClick}
            className="group flex items-center focus:outline-none"
            aria-label="Navigate to dashboard"
          >
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-sm border-2 border-blue-100 dark:border-gray-600">
              <FaHeartbeat className="h-7 w-7 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="ml-3 hidden md:block text-lg font-semibold text-blue-800 dark:text-white">
              Advanced Cardiac Care
            </span>
          </button>

          {/* Clinic Title (Centered) - Unchanged from your original */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-900 dark:text-white whitespace-nowrap">
                Advanced Cardiac Care
              </h1>
            </div>
            <div className="sm:hidden text-center">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                Dr. Dhara Singh
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-300">
                MBBS, MD, DM (Cardiology)
              </p>
            </div>
          </div>

          {/* Doctor Information - Preserved Exactly As Your Original */}
          <div className="hidden sm:block text-right space-y-0.5">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Dr. Dhara Singh
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              MBBS, MD (Medicine), DM (Cardiology)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Consultant Cardiologist
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              <span className="font-normal">Contact:</span> +1 234 5678
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { HeartPulse, Lock, Mail, UserPlus, AlertCircle } from "lucide-react";
import API from "../../../api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);

      if (res.data.user.isAdmin) {
        navigate("/adminDashboard");
      } else {
        navigate("/userDashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      <div className="bg-white px-6 py-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-50 p-3 rounded-full mb-3">
            <HeartPulse className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            HeartCare Portal
          </h2>
          <p className="text-gray-600 text-center mt-1 text-sm">
            Secure access to your cardiac health records
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
            <AlertCircle className="mr-2 flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400" size={18} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="text-right text-sm">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm md:text-base"
          >
            <Lock className="mr-2 " size={16} />
            Sign In
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col space-y-3 text-center">
            <p className="text-xs md:text-sm text-gray-600">
              Need help accessing your account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Contact support
              </span>
            </p>

            <Link
              to="/register"
              className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition text-sm"
            >
              <UserPlus className="mr-2" size={16} />
              <span className="font-medium">New here? Click to Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

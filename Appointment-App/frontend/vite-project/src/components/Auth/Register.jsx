import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

import axios from "axios";
import {
  User,
  Phone,
  Mail,
  Lock,
  Calendar,
  HeartPulse,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import API from "../../../api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    phoneNumber: "",
    email: "",
    password: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10); // Strictly 10 digits
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await API.post("/api/auth/register", formData);
      navigate("/login", { state: { registrationSuccess: true } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please verify your information."
      );
    } finally {
      setIsLoading(false);
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
      <div className="bg-white px-10 py-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-3 rounded-full">
            <HeartPulse className="text-blue-600 w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          HeartCare Portal
        </h2>
        <p className="text-gray-600 text-center mt-2 text-sm">
          Patient Registration
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {[
            {
              icon: <User className="h-4 w-4 text-gray-400" />,
              name: "username",
              type: "text",
              placeholder: "Full Name",
              required: true,
            },
            {
              icon: <Calendar className="h-4 w-4 text-gray-400" />,
              name: "age",
              type: "number",
              placeholder: "Age",
              required: true,
              min: 18,
              max: 120,
            },
            {
              icon: <User className="h-4 w-4 text-gray-400" />,
              name: "gender",
              type: "select",
              placeholder: "Select Gender",
              options: [
                { value: "", label: "Select Gender", disabled: true },
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
                { value: "O", label: "Other" },
              ],
              required: true,
            },
            {
              icon: <Phone className="h-4 w-4 text-gray-400" />,
              name: "phoneNumber",
              type: "tel",
              placeholder: "Phone Number",
              required: true,
            },
            {
              icon: <Mail className="h-4 w-4 text-gray-400" />,
              name: "email",
              type: "email",
              placeholder: "Email Address",
              required: true,
            },
            {
              icon: <Lock className="h-4 w-4 text-gray-400" />,
              name: "password",
              type: "password",
              placeholder: "Create Password (min 8 characters)",
              required: true,
              minLength: 8,
            },
          ].map((field, index) => (
            <div key={index} className="relative">
              {field.type === "select" ? (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <select
                    name={field.name}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    {field.options.map((option, i) => (
                      <option
                        key={i}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={
                      field.name === "phoneNumber"
                        ? handlePhoneChange
                        : handleChange
                    }
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    minLength={field.minLength}
                  />
                </>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <div className="text-center text-xs text-gray-500">
              By registering, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
            >
              <span className="text-sm font-medium">
                Already have an account? Sign in
              </span>
              <ChevronRight className="ml-1" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

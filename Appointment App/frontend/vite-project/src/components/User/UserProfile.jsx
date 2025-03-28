import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import API from "../../../api";
import {
  ClipboardList,
  Clock,
  Calendar,
  User as UserIcon,
  Mail,
  Phone,
  HeartPulse,
  Edit,
  Camera,
} from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your profile");
          return;
        }

        const decoded = jwtDecode(token);

        const [userRes, appointmentsRes] = await Promise.all([
          API.get(`/api/user/get/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/api/appointment/myAppointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log(userRes);

        setUser(userRes.data.user);
        setAppointments(appointmentsRes.data.appointments);

        // Set profile image if exists
        if (userRes.data.user.profileImage) {
          setImagePreview(
            `http://localhost:8000/${userRes.data.user.profileImage}`
          );
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigate("/user/edit-profile");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !profileImage) return;

      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const response = await API.post(
        `/api/user/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({ ...user, profileImage: response.data.profileImage });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading image");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-6 mb-8 text-white relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10" />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-blue-100">Cardiac Care Patient</p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-1 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {profileImage && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={uploadProfileImage}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Save Profile Image
            </button>
          </div>
        )}
      </div>

      {/* User Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <HeartPulse className="text-blue-600 mr-2" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="text-gray-500 mr-3 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="text-gray-500 mr-3 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ClipboardList className="text-blue-600 mr-2" />
            Medical Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {appointments.length}
              </p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "Completed").length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="text-blue-600 mr-2" />
            Appointment History
          </h2>
        </div>

        {appointments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <Clock className="text-gray-500 mr-2 w-5 h-5" />
                      <span className="font-medium text-gray-800">
                        {appointment.slot.startTime} -{" "}
                        {appointment.slot.endTime}
                      </span>
                    </div>
                    <p className="text-gray-600 ml-7">
                      {formatDate(appointment.slot.date)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No appointment history available
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

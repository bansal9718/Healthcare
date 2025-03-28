import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import API from "../../../api";

import {
  Home,
  Calendar,
  LogOut,
  Menu,
  User,
  Edit,
  Heart,
  X,
  Clock,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdminDashboard = () => {
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [thoughtOfTheDay, setThoughtOfTheDay] = useState(
    "Preventive cardiology leads to better long-term patient outcomes."
  );

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logging Out!");
    setTimeout(() => {
      navigate("/");
    }, 1300);
  };

  const generateThought = async () => {
    try {
      const response = await axios.get(
        "https://api.quotable.io/random?tags=health"
      );
      setThoughtOfTheDay(response.data.content);
    } catch (error) {
      console.error("Error fetching clinical insight:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [appointmentsRes, usersRes] = await Promise.all([
        API.get("/api/appointment/allAppointments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/api/user/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const sortedAppointments = appointmentsRes.data.appointments.sort(
        (a, b) => new Date(a.slot.date) - new Date(b.slot.date)
      );

      setAppointmentCount(sortedAppointments.length);
      setRecentAppointments(sortedAppointments);
      setUserCount(usersRes.data.users.length);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await API.get(
        `/api/appointment/getAppointmentsByDate/${
          new Date().toISOString().split("T")[0]
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sortedTodayAppointments = res.data.appointments.sort(
        (a, b) => new Date(a.slot.date) - new Date(b.slot.date)
      );

      setCurrentCount(sortedTodayAppointments.length);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
    fetchData();
    generateThought();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    let newStatus;

    if (currentStatus === "Completed") {
      newStatus = "Pending";
    } else if (currentStatus === "Pending") {
      newStatus = "Completed";
    } else {
      newStatus = "Cancelled";
    }

    try {
      // Optimistically update UI
      setRecentAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      // API request
      const res = await API.put(
        "/api/appointment/updateStatus",
        { appointmentId: id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      // Revert UI on failure
      setRecentAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: currentStatus }
            : appointment
        )
      );

      setError(error.response?.data?.message || "An error occurred");
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-6 left-6 z-30 p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? (
          <X className="text-red-600" />
        ) : (
          <Menu className="text-red-600" />
        )}
      </button>

      {/* Sidebar - Full Height */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-24"} ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } bg-gradient-to-b from-white to-gray-50 shadow-xl p-5 flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300 border-r border-gray-200`}
      >
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <Stethoscope className="text-red-600 w-8 h-8" />
                <span className="text-xl font-bold text-gray-800">
                  CardioAdmin
                </span>
              </div>
            )}
            <button
              className="hidden md:flex items-center justify-center p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="text-gray-600" />
              ) : (
                <ChevronRight className="text-gray-600" />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            <button
              className="flex items-center space-x-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all"
              onClick={() => {
                navigate("/admin/manageSlots");
                setMobileSidebarOpen(false);
              }}
            >
              <Calendar className="min-w-[24px]" />
              {sidebarOpen && <span className="font-medium">Manage Slots</span>}
            </button>
            <button
              className="flex items-center space-x-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all"
              onClick={() => {
                navigate("/admin/appointments");
                setMobileSidebarOpen(false);
              }}
            >
              <Home className="min-w-[24px]" />
              {sidebarOpen && <span className="font-medium">Appointments</span>}
            </button>
            <button
              className="flex items-center space-x-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all"
              onClick={() => {
                navigate("/admin/users");
                setMobileSidebarOpen(false);
              }}
            >
              <User className="min-w-[24px]" />
              {sidebarOpen && <span className="font-medium">Patients</span>}
            </button>
            <button
              className="flex items-center space-x-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all"
              onClick={() => {
                navigate("/admin/edit-profile");
                setMobileSidebarOpen(false);
              }}
            >
              <Edit className="min-w-[24px]" />
              {sidebarOpen && <span className="font-medium">Profile</span>}
            </button>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="border-t border-gray-200 pt-4">
            <button
              className="flex items-center space-x-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all"
              onClick={handleLogout}
            >
              <LogOut className="min-w-[24px]" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
          {sidebarOpen && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              v2.1.0 • Cardiac Suite
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-72" : "md:ml-24"
        } p-6`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold  text-gray-800 flex items-center">
              <Stethoscope className="text-red-600 mr-3" />
              Clinical Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-red-50 to-red-100 p-6 md:p-10 rounded-xl text-center border border-red-200 shadow-sm">
          <Heart size={40} className="text-red-600 mx-auto mb-3 md:mb-4" />
          <p className="text-xl md:text-3xl font-semibold text-gray-800">
            "Your heart health is our priority"
          </p>
          <p className="text-base md:text-lg text-gray-600 mt-2 md:mt-3">
            Advanced cardiac care with compassionate treatment
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton key={index} height={150} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Link to="/user/todayAppointments">
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 font-medium">
                      Today's Appointments
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {currentCount}
                    </p>
                  </div>

                  <div className="bg-red-100 p-3 rounded-full">
                    <Clock className="text-red-600 w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Activity className="mr-1 w-4 h-4" />
                  <span>Live data</span>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/appointments"
              className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {appointmentCount}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="text-blue-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="mr-1 w-4 h-4" />
                <span>All time records</span>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Patient Records</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {userCount - 1}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="text-green-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="mr-1 w-4 h-4" />
                <span>Registered patients</span>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">System Health</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">100%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircle className="text-purple-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="mr-1 w-4 h-4" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <ClipboardList className="text-red-600 mr-3" />
              Recent Consultations
            </h2>
          </div>

          {recentAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                            <User className="text-red-600 w-5 h-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.user?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.user?.email || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-2 text-gray-400 w-4 h-4" />
                          {formatDate(appointment.slot?.date)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="mr-2 text-gray-400 w-4 h-4" />
                          {appointment.slot?.startTime} -{" "}
                          {appointment.slot?.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              appointment._id,
                              appointment.status
                            )
                          }
                          className={`text-blue-600 cursor-pointer hover:text-blue-900 ${
                            appointment.status === "Completed"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={appointment.status === "Completed"}
                        >
                          Mark Completed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No recent consultations found
            </div>
          )}
        </div>

        {/* Thought of the Day */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-xl font-semibold text-blue-700 flex items-center">
            <ClipboardList className="mr-2" />
            Clinical Insight
          </h1>
          <p className="text-gray-700 mt-2 italic">"{thoughtOfTheDay}"</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Stethoscope className="text-red-600" />
              <span className="text-sm text-gray-600">
                © {new Date().getFullYear()} Cardiac Care Suite
              </span>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Privacy
              </Link>
              <Link
                to="/contact"
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="rounded-lg shadow-md"
        progressClassName="bg-red-500"
      />
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from "react";
import API from "../../../api";
import axios from "axios";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { Calendar, Clock, AlertCircle } from "react-feather";
import AddSlot from "./AddSlot";

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSlots = async () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/api/appointment/getSlots/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data.slots);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching slots");
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotAdded = () => {
    fetchSlots();
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.request({
        method: "DELETE",
        url: "http://localhost:8000/api/appointment/deleteSlot",
        headers: { Authorization: `Bearer ${token}` },
        data: { slotId },
      });
      fetchSlots();
    } catch (err) {
      console.error("Error deleting slot", err);
    }
  };

  return (
    <div className="p-6 min-h-screen mt-25 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            <Calendar className="inline mr-2 text-blue-600" size={20} />
            Appointment Slot Management
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Check for Slots
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-400" size={18} />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button
              onClick={fetchSlots}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
            >
              {isLoading ? "Searching..." : "Search Slots"}
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center text-red-600">
              <AlertCircle className="mr-2" size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Available Time Slots
          </h2>

          {slots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                {selectedDate
                  ? "Search for the Slots"
                  : "Select a date to view Available Slots"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <motion.div
                  key={slot._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-md border ${
                    slot.isBooked
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Clock
                          className={`mr-2 ${
                            slot.isBooked ? "text-red-600" : "text-green-600"
                          }`}
                          size={16}
                        />
                        <span className="font-medium text-gray-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        {new Date(slot.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          slot.isBooked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDeleteSlot(slot._id)}
                      disabled={slot.isBooked}
                      className={`flex items-center text-sm ${
                        slot.isBooked
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <MdDelete className="mr-1" size={16} />
                      Remove Slot
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <AddSlot
          onClose={() => setIsModalOpen(false)}
          onSlotAdded={handleSlotAdded}
        />
      )}
    </div>
  );
};

export default ManageSlots;

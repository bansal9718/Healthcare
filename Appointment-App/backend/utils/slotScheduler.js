const Slot = require("../Models/SlotModel");
const mongoose = require("mongoose");

const formatDate = (date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 14; hour < 20; hour++) {
    slots.push({
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${hour.toString().padStart(2, "0")}:30`,
    });
    slots.push({
      startTime: `${hour.toString().padStart(2, "0")}:30`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
    });
  }
  return slots;
};

const generateSlots = async () => {
  const slotTimes = generateTimeSlots(); // Generate time slots
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(); // ✅ Fix: Create a new Date object in each loop
    date.setDate(today.getDate() + i); // ✅ Correct date calculation
    const formattedDate = formatDate(date); // Convert date to YYYY-MM-DD format

    console.log(`Generating slots for: ${formattedDate}`); // ✅ Debugging log

    for (const slot of slotTimes) {
      const existingSlot = await Slot.findOne({
        date: formattedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      if (!existingSlot) {
        await Slot.create({
          date: formattedDate, // Store date as string
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: false,
        });
      }
    }
  }
  console.log("✅ Slots generated for the next 30 days.");
};

const deleteOldSlots = async () => {
  const today = new Date();
  const formattedToday = formatDate(today);

  await Slot.deleteMany({ date: { $lt: formattedToday } });
  console.log("🗑️ Old slots deleted.");
};

const slotScheduler = async () => {
  await generateSlots();
  await deleteOldSlots();
  setInterval(async () => {
    await generateSlots();
    await deleteOldSlots();
  }, 24 * 60 * 60 * 1000); // Every 24 hours
};

module.exports = slotScheduler;

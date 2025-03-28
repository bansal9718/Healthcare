require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const UserRoutes = require("./Routes/UserRoutes");
const AuthenticationRoutes = require("./Routes/AutheticationRoutes"); // Fixed Typo
const AppointmentRoutes = require("./Routes/AppointmentRoutes");
const AdminRoutes = require("./Routes/AdminRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
// Mounting the routes
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthenticationRoutes);
app.use("/api/appointment", AppointmentRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = app;

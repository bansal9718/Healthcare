const User = require("../Models/UserModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail")
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, age, phoneNumber, email, password, adminKey } = req.body;

    // Capitalize first letter of username
    const capitalizedUsername =
      username.charAt(0).toUpperCase() + username.slice(1);

    const phoneRegex = /^\+?\d{1,4}?\d{9,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Please enter a valid phone number with country code (e.g., +1234567890)",
      });
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return res.status(400).json({
        message: "Phone number must contain at least 10 digits",
      });
    }

    const existsingUser = await User.findOne({ email });
    if (existsingUser) {
      return res.status(400).json({ message: "User Already exists" });
    }

    let isAdmin = false;
    if (adminKey === process.env.ADMIN_SECRET) {
      isAdmin = true;
    }

    const user = await User.create({
      username: capitalizedUsername,
      age,
      phoneNumber,
      email,
      password,
      isAdmin,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
   
    // Email content
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.username},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(user.email, "Reset Your Password", html);

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword; // It will be hashed automatically in pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };

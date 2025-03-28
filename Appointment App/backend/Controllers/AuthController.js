const User = require("../Models/UserModel");

const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, age, phoneNumber, email, password, adminKey } = req.body;

    // Improved phone number validation
    const phoneRegex = /^\+?\d{1,4}?\d{9,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Please enter a valid phone number with country code (e.g., +1234567890)",
      });
    }

    // Check if phone number is at least 10 digits (excluding country code)
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
      username,
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

module.exports = { register, login, logout };

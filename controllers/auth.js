require("dotenv").config();
const generateTokenAndSetCookie = require("../utils/generateToken");
const DB = require("../models/user");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, userName, email, password, confirmPassword, gender } =
      req.body;
    if (
      !name ||
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password != confirmPassword) {
      return res.status(400).json({ error: "Password doesn't match" });
    }
    const userEmail = await DB.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ error: "Email already exist." });
    }
    const user = await DB.findOne({ userName });
    if (user) {
      return res.status(400).json({ error: "Username already exist." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new DB({
      name,
      userName,
      password: hashPassword,
      email,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();
      res.status(200).json({
        msg: "Register Successfully",
        _id: newUser._id,
        name: newUser.name,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error in register controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await DB.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }
    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      userName: user.userName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "Logout Successfully" });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  register,
  login,
  logout,
};

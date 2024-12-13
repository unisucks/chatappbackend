require("dotenv").config();
const jwt = require("jsonwebtoken");
const DB = require("../models/user");

module.exports = protectRoute;
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Make sure token is in the cookie
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ error: "Unauthorized No Token" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
    if (!decoded) {
      console.log("Invalid token");
      return res.status(401).json({ error: "Unauthorized Invalid Token" });
    }
    const user = await DB.findById(decoded.userId).select("-password"); // Find the user by userId
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "User Not Found" });
    }
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Unauthorized:Invalid Token" });
  }
};

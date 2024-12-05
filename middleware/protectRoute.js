require("dotenv").config();
const jwt = require("jsonwebtoken");
const DB = require("../models/user");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized No Token" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized Invalid Token" });
    }
    const user = await DB.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Unauthorized:Invalid Token" });
  }
};

module.exports = protectRoute;

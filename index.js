require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { app, server } = require("./socket/socket.cjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: "https://chatappfrontend-iota.vercel.app",

  credentials: true,
};
const PORT = process.env.PORT || 3005;
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://chatappfrontend-iota.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight request
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/messages", messageRoute);

server.listen(
  PORT,
  console.log(`Server is running at port ${process.env.PORT}`)
);

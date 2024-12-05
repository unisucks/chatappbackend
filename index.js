require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { app, server } = require("./socket/socket.cjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

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
  process.env.PORT,
  console.log(`Server is running at port ${process.env.PORT}`)
);

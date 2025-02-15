const conversationDB = require("../models/convsersation");
const messageDB = require("../models/message");
const { io, getReceiverSocketId } = require("../socket/socket.cjs");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let conversation = await conversationDB.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationDB.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new messageDB({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: usertoChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await conversationDB
      .findOne({
        participants: { $all: [senderId, usertoChatId] },
      })
      .populate("messages");
    if (!conversation) {
      return res.status(201).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getMessages, sendMessage };

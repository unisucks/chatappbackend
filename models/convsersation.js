const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
        deafult: [],
      },
    ],
  },
  { timestamps: true }
);

const conversation = mongoose.model("convsersation", conversationSchema);
module.exports = conversation;

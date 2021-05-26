const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: String, required: true },
  timestamp: { type: String, required: true },
  messageText: { type: String, required: true },
});

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roomID: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
});

module.exports = Item = mongoose.model("room", RoomSchema);

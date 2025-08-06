import mongoose, { Types } from "mongoose";

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: String,
  option: { type: Types.ObjectId, ref: "Option", required: true },
  poll: { type: Types.ObjectId, ref: "Poll", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vote", voteSchema);

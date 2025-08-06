import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  createdAt: { type: Date, default: Date.now },
});

optionSchema.virtual("votes", {
  ref: "Vote",
  localField: "_id",
  foreignField: "option",
  count: true, // ✅ Count instead of returning docs
});
optionSchema.set("toJSON", { virtuals: true });
optionSchema.set("toObject", { virtuals: true });

export default mongoose.model("Option", optionSchema);

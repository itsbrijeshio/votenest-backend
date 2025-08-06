import mongoose, { Types } from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    description: String,
    expiresAt: Date,
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

pollSchema.virtual("options", {
  ref: "Option",
  localField: "_id",
  foreignField: "poll",
});
pollSchema.set("toJSON", { virtuals: true });
pollSchema.set("toObject", { virtuals: true });

pollSchema.virtual("votes", {
  ref: "Vote",
  localField: "_id",
  foreignField: "poll",
});
pollSchema.set("toJSON", { virtuals: true });
pollSchema.set("toObject", { virtuals: true });

export default mongoose.model("Poll", pollSchema);

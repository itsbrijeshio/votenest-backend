import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    console.log("MONGO_URI", env.MONGO_URI);
    await mongoose.connect(env.MONGO_URI);
    console.info("DB Connected successfully!");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI", process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI as string);
    console.info("DB Connected successfully!");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;

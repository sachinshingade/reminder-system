import mongoose from "mongoose";
import logger from "./logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: process.env.MONGO_DB_NAME || "reminder_system"
    });
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

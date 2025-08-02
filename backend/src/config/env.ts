import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "",
  mongoURI: process.env.MONGO_URI || "",
  mongoDBName: process.env.MONGO_DB_NAME || "reminder_system",
  jwtSecret: process.env.JWT_SECRET || "",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: parseInt(process.env.REDIS_PORT || "6379"),
  redisPassword: process.env.REDIS_PASSWORD || "",
  redisDb: parseInt(process.env.REDIS_DB || "0"),
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || ""
};

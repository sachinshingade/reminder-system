import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { config } from "./config/env";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [config.corsOrigin],
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);

app.use(errorHandler);

export default app;

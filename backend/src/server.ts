import app from "./app";
import { connectDB } from "./config/db";
import { startReminderWorker } from "./services/reminderWorker";
import { config } from "./config/env";
import logger from "./config/logger";

connectDB();
startReminderWorker();

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

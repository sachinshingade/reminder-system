import { Worker } from "bullmq";
import Reminder from "../models/Reminder";
import User from "../models/User";
import { sendEmail } from "./emailService";
import logger from "../config/logger";

export const startReminderWorker = () => {
  const worker = new Worker(
    "reminders",
    async (job) => {
      console.log(`Processing job ${job.id}...`);
      const reminderId: string = job.data.reminderId;
      const reminder = await Reminder.findById(reminderId);
      if (!reminder || reminder.isSent) return;

      const user = await User.findById(reminder.user);
      if (!user) return;

      await sendEmail(
        user.email,
        `Reminder: ${reminder.title}`,
        reminder.description || ""
      );
      reminder.isSent = true;
      await reminder.save();
      logger.info(`Email sent for reminder ${reminder.title}`);
    },
    {
      connection: { host: "127.0.0.1", port: 6379 }
    }
  );

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });
};

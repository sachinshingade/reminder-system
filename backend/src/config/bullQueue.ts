import { Queue } from "bullmq";
import { config } from "./env";
import { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  db: config.redisDb
};

export const reminderQueue = new Queue("reminders", {
  connection: { ...redisOptions }
});

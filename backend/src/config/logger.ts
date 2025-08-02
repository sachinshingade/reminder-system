import { createLogger, transports, format } from "winston";

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} ${level}: ${stack || message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" })
  ]
});

export default logger;

import nodemailer from "nodemailer";
import { config } from "../config/env";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailUser,
      pass: config.emailPass
    }
  });

  await transporter.sendMail({
    from: config.emailUser,
    to,
    subject,
    text
  });
};

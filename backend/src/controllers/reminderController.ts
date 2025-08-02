import { Response, NextFunction } from "express";
import Reminder, { IReminder } from "../models/Reminder";
import { reminderQueue } from "../config/bullQueue";
import { AuthRequest } from "../types/auth";
import ErrorResponse from "../utils/errorResponse";

export const createReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, time } = req.body;
    const reminder = (await Reminder.create({
      user: req.user._id,
      title,
      description,
      time
    })) as IReminder & { _id: string };

    // Schedule job in BullMQ
    await reminderQueue.add(
      "sendReminder",
      { reminderId: reminder._id },
      {
        delay: new Date(time).getTime() - Date.now(),
        jobId: reminder?._id.toString()
      } // Use reminder ID as job ID
    );

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

export const getReminders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reminderId = req.params.id;
    const { title, description, time } = req.body;

    const reminder = await Reminder.findOne({
      _id: reminderId,
      user: req.user._id
    });

    if (!reminder) {
      return next(
        new ErrorResponse("Reminder not found or not authorized", 404)
      );
    }
    const oldTime = reminder.time;

    if (title !== undefined) reminder.title = title;
    if (description !== undefined) reminder.description = description;
    if (time !== undefined) reminder.time = new Date(time);

    await reminder.save();
    if (
      time &&
      new Date(time).getTime() !== new Date(oldTime).getTime() &&
      reminderId
    ) {
      // 1. Remove old job
      const oldJob = await reminderQueue.getJob(reminderId);
      if (oldJob) {
        await oldJob.remove();
      }

      // 2. Add new delayed job
      await reminderQueue.add(
        "sendReminder",
        { reminderId: reminderId.toString() },
        {
          delay: new Date(reminder.time).getTime() - Date.now(),
          jobId: reminderId.toString()
        }
      );
    }
    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reminderId = req.params.id;
    if (!reminderId) {
      return next(new ErrorResponse("Reminder ID is required", 400));
    }
    const reminder = await Reminder.findOneAndDelete({
      _id: reminderId,
      user: req.user._id
    });

    if (!reminder) {
      return next(
        new ErrorResponse("Reminder not found or not authorized", 404)
      );
    }

    // Remove any pending BullMQ job
    const job = await reminderQueue.getJob(reminderId);
    if (job) {
      await job.remove();
    }

    res
      .status(200)
      .json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    next(error);
  }
};

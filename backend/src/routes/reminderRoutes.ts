import express, { RequestHandler } from "express";
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder
} from "../controllers/reminderController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(protect, createReminder as RequestHandler)
  .get(protect, getReminders as RequestHandler);

router
  .route("/:id")
  .put(protect, updateReminder as RequestHandler)
  .delete(protect, deleteReminder as RequestHandler);

export default router;

import express, { RequestHandler } from "express";
import {
  register,
  login,
  getUser,
  logoutUser
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", protect, getUser as RequestHandler);
router.post("/logout", protect, logoutUser);

export default router;

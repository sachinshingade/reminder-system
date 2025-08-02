import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import { config } from "../config/env";
import { AuthRequest } from "../types/auth";

const sendTokenResponse = (userId: string, res: Response) => {
  const token = jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "7d"
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ success: true });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return next(new ErrorResponse("User already exists", 400));

    const user = await User.create({ email, password });

    sendTokenResponse(user._id.toString(), res);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse("Invalid credentials", 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));

    sendTokenResponse(user._id.toString(), res);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

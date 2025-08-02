import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import { config } from "../config/env";

interface JwtPayload {
  id: string;
}

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return next(new ErrorResponse("Not authorized", 401));

  try {
    // Verify JWT and extract user ID
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return next(new ErrorResponse("User not found", 404));
    next();
  } catch (error) {
    next(new ErrorResponse("Not authorized", 401));
  }
};

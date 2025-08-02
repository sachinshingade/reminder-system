import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import logger from "../config/logger";

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
};

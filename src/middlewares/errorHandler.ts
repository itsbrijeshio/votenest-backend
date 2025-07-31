import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { ApiError, logger } from "../utils";

const formatZodError = (zodError: ZodError) => {
  const messageArr = zodError.issues?.map((issue: ZodIssue) => issue.message);
  return messageArr?.join(", ");
};

const sendErrorResponse = (
  res: Response,
  status: number,
  type: string,
  message: string
) => {
  const metadata = {
    timestamp: new Date().toISOString(),
  };

  return res.status(status).json({
    success: false,
    status,
    error: {
      type,
      message,
    },
    metadata,
  });
};

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return sendErrorResponse(res, err.status, err.type, err.message);
  }

  if (err instanceof ZodError) {
    return sendErrorResponse(res, 400, "VALIDATION", formatZodError(err));
  }

  logger.error(
    `[${req.method}] ${req.path} - ${err instanceof Error ? err.stack : err}`
  );

  return sendErrorResponse(
    res,
    500,
    "INTERNAL_SERVER",
    process.env.NODE_ENV === "development"
      ? err.toString()
      : "Something went wrong"
  );
};

export default errorHandler;

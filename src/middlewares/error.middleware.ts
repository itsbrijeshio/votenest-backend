import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { ApiError, logger } from "../utils";

const formatZodError = (zodError: ZodError) => {
  const messageArr = zodError.issues?.map((issue: ZodIssue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return messageArr;
};

const sendErrorResponse = <T>(res: Response, status: number, error: T) => {
  return res.status(status).json({
    success: false,
    status,
    error,
  });
};

const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    const error = { type: err.type, message: err.message };
    return sendErrorResponse(res, err.status, error);
  }

  if (err instanceof ZodError) {
    const error = {
      type: "VALIDATION",
      details: formatZodError(err),
    };
    return sendErrorResponse(res, 400, error);
  }

  logger.error(
    `[${req.method}] ${req.path} - ${err instanceof Error ? err.stack : err}`
  );

  const error = {
    type: "INTERNAL_SERVER",
    message:
      process.env.NODE_ENV === "development"
        ? err.toString()
        : "Something went wrong",
  };
  return sendErrorResponse(res, 500, error);
};

export default errorMiddleware;

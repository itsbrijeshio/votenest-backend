import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { ApiError, logger } from "../utils";
import { serverMsg } from "../constants";
import { ErrorInput } from "../types";
import { MongooseError } from "mongoose";

const formatZodError = (zodError: ZodError) => {
  const messageArr = zodError.issues?.map((issue: ZodIssue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return messageArr;
};

const sendErrorResponse = <T>(
  res: Response,
  status: number,
  error: ErrorInput<T>
) => {
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
    return sendErrorResponse(res, 400, {
      type: "BAD_REQUEST",
      details: formatZodError(err),
    });
  }

  if (err instanceof MongooseError) {
    return sendErrorResponse(res, 500, {
      type: "INTERNAL_SERVER_ERROR",
      message: serverMsg.MONGO_ERROR,
    });
  }

  logger.error(
    `[${req.method}] ${req.path} - ${err instanceof Error ? err.stack : err}`
  );

  const message = serverMsg.INTERNAL_SERVER_ERROR;
  return sendErrorResponse(res, 500, {
    type: "INTERNAL_SERVER_ERROR",
    message,
  });
};

export default errorMiddleware;

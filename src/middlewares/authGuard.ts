import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import { NextFunction, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

const authGuard: any = (req: any, res: Response, next: NextFunction) => {
  const headerToken = Array.isArray(req.headers?.["x-access-token"])
    ? req.headers["x-access-token"][0]
    : req.headers?.["x-access-token"];

  const token = headerToken?.toString();
  const accessToken = req.cookies?.["access_token"] || token;

  try {
    if (!accessToken) {
      throw new ApiError({
        type: "UNAUTHORIZED",
        status: 401,
        message: "You are not logged in.",
      });
    }

    const decoded: any = jwt.verify(accessToken, JWT_SECRET);
    req.auth = { id: decoded.id };

    if (!req.auth?.id) {
      throw new ApiError({
        type: "UNAUTHORIZED",
        status: 401,
        message: "Your session has expired. Please log in again.",
      });
    }
    next();
  } catch (error) {
    throw new ApiError({
      type: "UNAUTHORIZED",
      status: 401,
      message: "You are not logged in.",
    });
  }
};

export default authGuard;

import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import { NextFunction, Request, Response } from "express";
import { env } from "../config";

const JWT_SECRET = env.JWT_SECRET;

interface JwtResponse {
  _id: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = Array.isArray(req.headers?.["x-access-token"])
    ? req.headers["x-access-token"][0]
    : req.headers?.["x-access-token"];

  const token = headerToken?.toString();
  const accessToken = req.cookies?.["token"] || token;

  try {
    if (!accessToken) {
      throw new ApiError({
        type: "UNAUTHORIZED",
        status: 401,
        message: "You are not logged in.",
      });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtResponse;
    req.auth = { _id: decoded?._id };

    if (!req.auth?._id) {
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

export default authMiddleware;

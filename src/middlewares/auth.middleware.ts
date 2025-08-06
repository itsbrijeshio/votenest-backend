import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import { NextFunction, Request, Response } from "express";
import { env } from "../config";
import { userMsg } from "../constants";

const JWT_SECRET = env.JWT_SECRET;

interface JwtResponse {
  _id: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers?.authorization?.split(" ")[1];

  const token = headerToken?.toString();
  const accessToken = req.cookies?.["token"] || token;

  try {
    if (!accessToken) {
      throw new ApiError({
        type: "UNAUTHORIZED",
        status: 401,
        message: userMsg.NOT_LOGGED_IN,
      });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtResponse;
    req.auth = { _id: decoded?._id };

    if (!req.auth?._id) {
      throw new ApiError({
        type: "UNAUTHORIZED",
        status: 401,
        message: userMsg.TOKEN_INVALID,
      });
    }
    next();
  } catch (error) {
    throw new ApiError({
      type: "UNAUTHORIZED",
      status: 401,
      message: userMsg.TOKEN_INVALID,
    });
  }
};

export default authMiddleware;

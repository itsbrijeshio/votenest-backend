import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";

const JWT_SECRET = env.JWT_SECRET;

const signCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "3d",
  });

  const httpOptions = {
    secure: env.NODE_ENV == "production", // Enable secure cookies for HTTPS
    httpOnly: true,
  };

  res.cookie("token", token, httpOptions);
  return token;
};

export default signCookie;

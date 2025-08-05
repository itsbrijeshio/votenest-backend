import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

const signCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "1d",
  });

  const httpOptions = {
    secure: process.env.NODE_ENV == "production", // Enable secure cookies for HTTPS
    httpOnly: true,
  };

  res.cookie("token", token, httpOptions);
  return token;
};

export default signCookie;

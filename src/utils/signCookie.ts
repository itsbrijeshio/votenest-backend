import { Response } from "express";
import jwt from "jsonwebtoken";

const oneDay = 1000 * 60 * 60 * 24;

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

const signCookie = (res: Response, secret: string, options?: any): string => {
  const token = jwt.sign({ id: secret }, JWT_SECRET, {
    expiresIn: parseInt(JWT_EXPIRES_IN) * oneDay || oneDay * 7,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  };

  res.cookie("access_token", token, cookieOptions);
  return token;
};

export default signCookie;

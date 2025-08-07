import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";

const JWT_SECRET = env.JWT_SECRET;

const signCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "3d",
  });

  type SameSiteOption = "none" | "lax" | "strict";

  const getSameSiteSetting = (): SameSiteOption => {
    return env.NODE_ENV === "production" ? "none" : "lax";
  };

  const httpOptions = {
    secure: env.NODE_ENV == "production", // Enable secure cookies for HTTPS
    httpOnly: true,
    sameSite: getSameSiteSetting(),
  };

  res.cookie("token", token, httpOptions);
  return token;
};

export default signCookie;

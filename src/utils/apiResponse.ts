import { Response } from "express";
import { UserDocument } from "../services/auth.service";

interface ApiResponseData extends UserDocument {
  message?: string;
}

interface ApiResponseOptions {
  [key: string]: unknown;
}

const apiResponse = (
  res: Response,
  statusCode: number,
  data: ApiResponseData | null = null,
  rest: ApiResponseOptions | null = {}
): Response => {
  const message = data?.message || "Success";
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    ...rest,
  });
};

export default apiResponse;

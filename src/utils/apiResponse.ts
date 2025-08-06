import { Response } from "express";

interface ApiMessage {
  message?: string;
}

interface ApiResponseOptions {
  [key: string]: unknown;
}

const apiResponse = <T>(
  res: Response,
  status: number,
  data: T | null = null,
  rest: ApiResponseOptions | null = {}
): Response => {
  const message = "Success";
  return res.status(status).json({
    success: true,
    status,
    message,
    data,
    ...rest,
  });
};

export default apiResponse;

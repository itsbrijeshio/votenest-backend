import { Response } from "express";

const response = (
  res: Response,
  statusCode: number,
  data: any = undefined,
  args?: any
) => {
  const message = data?.message;
  delete data?.message;
  const metadata = {
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json({
    success: true,
    status: "success",
    message,
    data,
    ...args,
    metadata,
  });
};

export default response;

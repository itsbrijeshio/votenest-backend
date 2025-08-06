import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Schema } from "zod";
import { ApiError } from "../utils";
import { serverMsg } from "../constants";

type Source = "body" | "params" | "query";

const validateMiddleware =
  (schema: Schema, source: Source = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    const values = req[source];
    await schema.parseAsync(values);
    next();
  };

const validateId =
  (prop: string, source: Source = "params") =>
  (req: Request, res: Response, next: NextFunction) => {
    const id = req[source][prop] as unknown as string;
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new ApiError({
        type: "BAD_REQUEST",
        status: 400,
        message: serverMsg.INVALID_MONGO_ID,
      });
    }
    next();
  };

validateMiddleware.validateId = validateId;
export default validateMiddleware;

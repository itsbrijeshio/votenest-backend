import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

type Source = "body" | "params" | "query";

const validateRequest =
  (schema: Schema, source: Source = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    const values = req[source];
    await schema.parseAsync(values);
    next();
  };

export default validateRequest;

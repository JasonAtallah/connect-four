import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateReqVar =
  <T>(schema: AnyZodObject, reqVarName: string = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req as Request & { [reqVarName: string]: T };
      await schema.parseAsync(data[reqVarName]);

      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

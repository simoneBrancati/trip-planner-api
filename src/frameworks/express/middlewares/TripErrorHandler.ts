import { NextFunction, Request, Response } from "express";
import logger from "../../../utils/Logger";
import CustomError from "../../../errors/CustomError";

/**
 * The error handler middleware for the Trip planner API.
 *
 * @param err Error instance.
 * @param _
 * @param res Express Response object.
 * @param next Express Next function.
 * @returns void
 */
const tripErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof CustomError) {
    res.status(err.errorCode).send({ error: err.message });

    return;
  }

  logger.error(err.stack);
  res.status(500).send({ error: "Some error occurred" });

  next();
};

export default tripErrorHandler;

import { NextFunction, Request, Response } from "express";
import NotFoundError from "../../../errors/NotFoundError";
import ServerError from "../../../errors/ServerError";
import logger from "../../../utils/logger";

const tripErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof NotFoundError) {
    res.status(404).send({ error: err.message });

    return;
  }

  if (err instanceof ServerError) {
    res.status(500).send({ error: err.message });

    return;
  }

  logger.error(err.stack);
  res.status(500).send({ error: "Some error occurred" });

  next();
};

export default tripErrorHandler;
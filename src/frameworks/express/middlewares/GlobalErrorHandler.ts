import { NextFunction, Request, Response } from "express";

/**
 * Error handling middleware that handles all errors not already handled by route / resource specific handlers.
 * It usually handles all the HTTP Requests sent to paths different from the registered routes, responding with 404.
 *
 * @param _
 * @param res Express Response object.
 * @param next Express Next function.
 */
const globalErrorHandler = (_: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ error: "Not Found" });

  next();
};

export default globalErrorHandler;

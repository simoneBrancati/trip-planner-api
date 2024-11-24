import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (_: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ error: "Not Found" });

  next();
};

export default globalErrorHandler;

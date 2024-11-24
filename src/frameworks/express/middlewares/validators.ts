import { NextFunction, Request, Response } from "express";
import {
  validateIATACode,
  validateSortingStrategy,
} from "../../../utils/validations";

export const getTripsValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { origin, destination, sortBy } = req.query;
  if (!validateIATACode(origin)) {
    res.status(400).send({ message: "Invalid origin" });

    return;
  }

  if (!validateIATACode(destination)) {
    res.status(400).send({ message: "Invalid origin" });

    return;
  }

  if (!validateSortingStrategy(sortBy)) {
    res.status(400).send({ message: "Invalid sorting strategy: '${sortBy}'" });

    return;
  }

  next();
};

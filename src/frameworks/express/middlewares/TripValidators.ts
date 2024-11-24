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
  const { origin, destination, sort_by } = req.query;
  if (!validateIATACode(origin)) {
    res
      .status(400)
      .send({ message: "Query parameter 'origin' must be a valid IATA code." });

    return;
  }

  if (!validateIATACode(destination)) {
    res.status(400).send({
      message: "Query parameter 'destination' must be a valid IATA code.",
    });

    return;
  }

  if (!validateSortingStrategy(sort_by)) {
    res.status(400).send({
      message:
        "Query parameter 'sort_by' must be one of 'fastest' or 'cheapest'.",
    });

    return;
  }

  next();
};

import { NextFunction, Request, Response } from "express";
import {
  validateIATACode,
  validateSortingStrategy,
  validateTrip,
} from "../../../utils/Validations";

/**
 * Validator for the getTrips API.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 * @returns void
 */
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

  if (sort_by !== undefined && !validateSortingStrategy(sort_by)) {
    res.status(400).send({
      message:
        "Query parameter 'sort_by' must be one of 'fastest' or 'cheapest'.",
    });

    return;
  }

  next();
};

/**
 * Validator for the saveTrip API.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 * @returns void
 */
export const saveTripValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { trip } = req.query;
  if (!validateTrip(trip)) {
    res.status(400).send({ message: "Input trip is not valid" });

    return;
  }

  next();
};

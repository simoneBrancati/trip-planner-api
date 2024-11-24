import { NextFunction, Request, Response } from "express";
import { getSortedTrips } from "../use_cases/GetSortedTrips";
import { HttpTripGateway } from "../gateways/HttpGateway";
import { IATACode } from "../entities/IATACodes";
import { SortingStrategy } from "../entities/Trip";

export const getTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { origin, destination, sortBy } = req.query;
  try {
    const tripGateway = HttpTripGateway();

    const trips = await getSortedTrips(
      origin as IATACode,
      destination as IATACode,
      sortBy as SortingStrategy,
      tripGateway,
    );
    res.setHeader("Content-Type", "application/json").send(trips);

    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

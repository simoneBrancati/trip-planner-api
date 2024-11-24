import { NextFunction, Request, Response } from "express";
import { getSortedTrips } from "../use_cases/GetSortedTrips";
import { HttpTripGateway } from "../gateways/HttpGateway";
import { IATACode } from "../entities/IATACodes";
import { SortingStrategy } from "../entities/Trip";
import { RedisCacheGateway } from "../gateways/RedisGateway";

/**
 * Controller function that connects the business core logic to the express application framework.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 */
export const getTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { origin, destination, sort_by } = req.query;
  try {
    const tripGateway = HttpTripGateway();
    const cacheGateway = RedisCacheGateway();

    const trips = await getSortedTrips(
      origin as IATACode,
      destination as IATACode,
      sort_by as SortingStrategy | undefined,
      tripGateway,
      cacheGateway,
    );

    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

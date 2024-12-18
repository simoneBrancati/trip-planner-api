import { NextFunction, Request, Response } from "express";
import { getSortedTrips } from "../use_cases/GetSortedTrips";
import { saveTrip as logicSaveTrip } from "../use_cases/SaveTrip";
import { listSavedTrips as logicListSavedTrips } from "../use_cases/ListSavedTrips";
import { deleteTrip as logicDeleteTrip } from "../use_cases/DeleteTrip";
import { HttpTripGateway } from "../gateways/HttpGateway";
import { IATACode } from "../entities/IATACodes";
import { SortingStrategy, Trip } from "../entities/Trip";
import { RedisCacheGateway } from "../gateways/RedisGateway";
import { MongoRepositoryGateway } from "../gateways/MongoDbGateway";

/**
 * Controller function that connects the business core logic to the express application framework.
 * Get trips from a 3rd party API and return it to the user.
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

/**
 * Controller function that connects the business core logic to the express application framework.
 * Save a trip to the repository.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 */
export const saveTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { trip } = req.body;
  try {
    const repositoryGateway = MongoRepositoryGateway();

    const savedTrip = await logicSaveTrip(trip as Trip, repositoryGateway);

    res.status(200).json({ trip: savedTrip });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller function that connects the business core logic to the express application framework.
 * List saved trips from the repository.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 */
export const listSavedTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const repositoryGateway = MongoRepositoryGateway();

    const trips = await logicListSavedTrips(repositoryGateway);

    res.status(200).json({ trips });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller function that connects the business core logic to the express application framework.
 * Delete a saved trip from the repository.
 *
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express Next function.
 */
export const deleteTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.query;

    const repositoryGateway = MongoRepositoryGateway();

    const success = await logicDeleteTrip(id as string, repositoryGateway);
    if (!success) {
      res.status(404).json({ error: `Trip with id '${id}' not found` });

      return;
    }

    res
      .status(200)
      .json({ message: `Trip with id '${id}' deleted successfully` });
  } catch (err) {
    next(err);
  }
};

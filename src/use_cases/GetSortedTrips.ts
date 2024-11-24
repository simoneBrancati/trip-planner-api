import { IATACode } from "../entities/IATACodes";
import { SortingStrategy, Trip } from "../entities/Trip";
import { TripGateway } from "../gateways/TripGateway";
import {
  validateIATACode,
  validateSortingStrategy,
} from "../utils/Validations";
import { getSortingFunction } from "./TripSorting";

/**
 * Retrieves and sorts trips by the specified strategy.
 * @param origin - Origin IATA code.
 * @param destination - Destination IATA code.
 * @param sortBy - Sorting strategy ("cheapest" or "fastest").
 * @param tripGateway - Gateway for fetching trips.
 * @returns An array of trips sorted by the specified strategy.
 */
export const getSortedTrips = async (
  origin: IATACode,
  destination: IATACode,
  sortBy: SortingStrategy,
  tripGateway: TripGateway,
): Promise<Trip[]> => {
  // Validation
  if (!validateIATACode(origin) || !validateIATACode(destination)) {
    throw new Error("Origin and/or destination must be provided.");
  }

  if (!validateSortingStrategy(sortBy)) {
    throw new Error(`Invalid sorting strategy "${sortBy}".`);
  }

  // Fetch trips from the gateway
  const trips = await tripGateway.fetchTrips(origin, destination);

  // Sorting
  const sortFunction = getSortingFunction(sortBy);
  return sortFunction(trips);
};

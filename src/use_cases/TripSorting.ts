import { IATACode } from "../entities/IATACodes";
import { SortingFunction, SortingStrategy, Trip } from "../entities/Trip";
import { TripGateway } from "../gateways/TripGateway";

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
  if (!origin || !destination) {
    throw new Error("Origin and destination must be provided.");
  }

  if (!["cheapest", "fastest"].includes(sortBy)) {
    throw new Error(`Invalid sorting strategy "${sortBy}".`);
  }

  // Fetch trips from the gateway
  const trips = await tripGateway.fetchTrips(origin, destination);

  // Sorting
  const sortFunction = getSortingFunction(sortBy);
  return sortFunction(trips);
};

/**
 * Sorts trips based on the specified sorting strategy.
 * @param trips - The array of Trip objects to sort.
 * @param sortingStrat - The sorting strategy to use ("cheapest" or "fastest").
 * @returns An array of trips sorted by the specified strategy.
 */
export const getSortingFunction = (
  sortingStrat: SortingStrategy,
): SortingFunction => {
  const strategies: Record<SortingStrategy, SortingFunction> = {
    cheapest: sortByCheapest,
    fastest: sortByFastest,
  };

  const sortFunction = strategies[sortingStrat];
  if (!sortFunction) {
    throw new Error(`Sorting strategy "${sortingStrat}" is not supported.`);
  }

  return sortFunction;
};

/**
 * Sorts trips based on the cost
 * @param trips - The array of Trip objects to sort.
 * @returns A new array of Trip objects sorted by their cost
 */
export const sortByCheapest = (trips: Trip[]): Trip[] => {
  return trips.slice().sort((a, b) => a.cost - b.cost);
};

/**
 * Sorts trips based on the duration
 * @param trips - The array of Trip objects to sort.
 * @returns A new array of Trip objects sorted by their duration
 */
export const sortByFastest = (trips: Trip[]): Trip[] => {
  return trips.slice().sort((a, b) => a.duration - b.duration);
};

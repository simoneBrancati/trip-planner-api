import { SortingStrategy, Trip } from "../entities/Trip";

export const sortTrips = (
  trips: Trip[],
  sortingStrat: SortingStrategy,
): Trip[] => {
  if (sortingStrat === "cheapest") {
    return sortByCheapest(trips);
  }

  if (sortingStrat === "fastest") {
    return sortByFastest(trips);
  }

  return trips;
};

export const sortByCheapest = (trips: Trip[]): Trip[] => {
  return trips.slice().sort((a, b) => a.cost - b.cost);
};

export const sortByFastest = (trips: Trip[]): Trip[] => {
  return trips.slice().sort((a, b) => a.duration - b.duration);
};

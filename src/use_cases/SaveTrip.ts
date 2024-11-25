import { Trip } from "../entities/Trip";
import { TripsRepository } from "../gateways/TripsRepositoryGateway";
import { validateTrip } from "../utils/Validations";

/**
 * Save a trip to the Trips repository.
 *
 * @param trip - Trip object to save.
 * @param tripsRepository - Repository that contains trips.

 * @returns the saved trip
 */
export const saveTrip = async (
  trip: Trip,
  tripsRepository: TripsRepository,
): Promise<Trip> => {
  if (!validateTrip(trip)) {
    throw new Error("Trip to save is not valid");
  }

  return tripsRepository.save(trip);
};

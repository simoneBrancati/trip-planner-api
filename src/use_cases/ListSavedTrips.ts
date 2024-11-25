import { Trip } from "../entities/Trip";
import { TripsRepository } from "../gateways/TripsRepositoryGateway";

/**
 * List trips saved in the repository.
 *
 * @param tripsRepository - Repository that contains trips.

 * @returns the saved trip
 */
export const listSavedTrips = async (
  tripsRepository: TripsRepository,
): Promise<Trip[]> => {
  return tripsRepository.findAll();
};

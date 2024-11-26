import { TripsRepository } from "../gateways/TripsRepositoryGateway";
import { isNonEmptyString } from "../utils/Validations";

/**
 * Deletes a trip if found in the Trips repository.
 *
 * @param id - Trip id to delete.
 * @param tripsRepository - Repository that contains trips.

 * @returns the saved trip
 */
export const deleteTrip = async (
  id: string,
  tripsRepository: TripsRepository,
): Promise<boolean> => {
  if (!isNonEmptyString(id)) {
    throw new Error("Trip id to delete is not valid");
  }

  return tripsRepository.deleteById(id);
};

import { IATACode } from "../entities/IATACodes";
import { Trip } from "../entities/Trip";

export interface TripGateway {
  fetchTrips(origin: IATACode, destination: IATACode): Promise<Trip[]>;
}

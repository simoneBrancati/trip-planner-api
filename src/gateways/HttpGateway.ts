import axios from "axios";
import { Trip } from "../entities/Trip";
import { TripGateway } from "./TripGateway";
import { IATACode } from "../entities/IATACodes";

export const HttpTripGateway = (): TripGateway => {
  const fetchTrips = async (
    origin: IATACode,
    destination: IATACode,
  ): Promise<Trip[]> => {
    try {
      const response = await axios.get(`${process.env.TRIPS_API_URL}`, {
        params: { origin, destination },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch trips from API");
      }

      return response.data as Trip[];
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw new Error("Unable to fetch trips");
    }
  };

  return {
    fetchTrips,
  };
};

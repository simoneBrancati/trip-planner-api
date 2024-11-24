import axios from "axios";
import { Trip } from "../entities/Trip";
import { TripGateway } from "./TripGateway";
import { IATACode } from "../entities/IATACodes";
import logger from "../utils/logger";

const instance = axios.create({
  baseURL: process.env.TRIPS_API_URL,
  timeout: 10000,
  params: {
    "x-api-key": process.env.API_KEY,
  },
});

export const HttpTripGateway = (): TripGateway => {
  const fetchTrips = async (
    origin: IATACode,
    destination: IATACode,
  ): Promise<Trip[]> => {
    try {
      const axiosResponse = await instance.get("/trips", {
        params: { origin, destination },
      });

      if (axiosResponse.status !== 200) {
        logger.error("API ERROR - GET REQUEST: Failed to fetch trips from API");
        throw new Error("Failed to fetch trips from API");
      }

      return axiosResponse.data as Trip[];
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`${error.message}, Stack: ${error.stack}`);
      } else {
        logger.error("API ERROR - GET REQUEST: Unknown Error");
      }

      throw new Error("Unable to fetch trips");
    }
  };

  return {
    fetchTrips,
  };
};

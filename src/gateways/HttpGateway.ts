import axios, { AxiosResponse } from "axios";
import { Trip } from "../entities/Trip";
import { TripGateway } from "./TripGateway";
import { IATACode } from "../entities/IATACodes";
import logger from "../utils/Logger";
import NotFoundError from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import { AxiosError } from "axios";

/**
 * Creates a Gateway to connect business logic and the external trips API.
 *
 * @param timeout Http requests timeout for the 3rd party API
 * @returns A TripGateway instance.
 */
export const HttpTripGateway = (timeout = 10000): TripGateway => {
  const instance = axios.create({
    baseURL: process.env.TRIPS_API_URL,
    timeout,
    headers: {
      "x-api-key": process.env.API_KEY,
    },
  });

  /**
   * Performs an HTTP GET Request to 3rd party API to retrieve trip objects.
   *
   * @param origin - Origin IATA code.
   * @param destination - Destination IATA code.
   * @returns A list of Trips.
   */
  const fetchTrips = async (
    origin: IATACode,
    destination: IATACode,
  ): Promise<Trip[]> => {
    try {
      const axiosResponse = await instance.get("/trips", {
        params: { origin, destination },
      });

      handleErrors(axiosResponse);

      return axiosResponse.data as Trip[];
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`${error.message}, Stack: ${error.stack}`);
        if (!error.response) {
          throw new ServerError("Internal Server Error");
        }

        handleErrors(error.response);
      }

      const logMsg =
        error instanceof Error
          ? `${error.message}, Stack: ${error.stack}`
          : "API ERROR - GET REQUEST: Unknown Error";
      logger.error(logMsg);

      throw new ServerError("Internal Server Error");
    }
  };

  return {
    fetchTrips,
  };
};

/**
 * Handles potential errors coming from the AxiosResponse.
 *
 * @param response An instance of AxiosResponse
 */
const handleErrors = (response: AxiosResponse) => {
  if (response.status > 399) {
    if (response.status === 404) {
      throw new NotFoundError("Requested section not found");
    }

    throw new ServerError("Internal Server Error");
  }
};

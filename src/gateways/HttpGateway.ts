import axios, { AxiosResponse } from "axios";
import { Trip } from "../entities/Trip";
import { TripGateway } from "./TripGateway";
import { IATACode } from "../entities/IATACodes";
import logger from "../utils/logger";
import NotFoundError from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import { AxiosError } from "axios";

export const HttpTripGateway = (timeout = 10000): TripGateway => {
  const instance = axios.create({
    baseURL: process.env.TRIPS_API_URL,
    timeout,
    headers: {
      "x-api-key": process.env.API_KEY,
    },
  });

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
        if (error.response) {
          handleErrors(error.response);
        } else {
          throw new ServerError("Internal Server Error");
        }
      }

      if (error instanceof Error) {
        logger.error(`${error.message}, Stack: ${error.stack}`);
      } else {
        logger.error("API ERROR - GET REQUEST: Unknown Error");
      }

      throw new ServerError("Internal Server Error");
    }
  };

  return {
    fetchTrips,
  };
};

const handleErrors = (response: AxiosResponse) => {
  if (response.status > 399) {
    if (response.status === 404) {
      throw new NotFoundError("Requested section not found");
    }

    throw new ServerError("Internal Server Error");
  }
};

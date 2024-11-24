import axios, { AxiosError, AxiosResponse } from "axios";
import { HttpTripGateway } from "../src/gateways/HttpGateway";
import { IATACode } from "../src/entities/IATACodes";
import NotFoundError from "../src/errors/NotFoundError";
import ServerError from "../src/errors/ServerError";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HttpTripGateway", () => {
  mockedAxios.create.mockReturnValue(mockedAxios);
  const gateway = HttpTripGateway();

  const mockResponse = {
    status: 200,
    data: [
      {
        origin: "LAX",
        destination: "ATL",
        cost: 4764,
        duration: 14,
        type: "flight",
        id: "653da20d-cbaa-4762-8def-3ed627390d0c",
        display_name: "from LAX to ATL by flight",
      },
      {
        origin: "LAX",
        destination: "ATL",
        cost: 2403,
        duration: 15,
        type: "car",
        id: "87abc816-51bb-4041-a561-10d7bfe0038a",
        display_name: "from LAX to ATL by car",
      },
    ],
  };

  const origin: IATACode = "LAX";
  const destination: IATACode = "ATL";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return successful response with trips array", async () => {
    mockedAxios.get.mockResolvedValue(mockResponse);

    const trips = await gateway.fetchTrips(origin, destination);

    expect(mockedAxios.get).toHaveBeenCalledWith("/trips", {
      params: { origin, destination },
    });
    expect(trips).toStrictEqual([
      {
        origin: "LAX",
        destination: "ATL",
        cost: 4764,
        duration: 14,
        type: "flight",
        id: "653da20d-cbaa-4762-8def-3ed627390d0c",
        display_name: "from LAX to ATL by flight",
      },
      {
        origin: "LAX",
        destination: "ATL",
        cost: 2403,
        duration: 15,
        type: "car",
        id: "87abc816-51bb-4041-a561-10d7bfe0038a",
        display_name: "from LAX to ATL by car",
      },
    ]);
  });

  it("should throw NotFoundError when the API returns a 404 status", async () => {
    const error = new AxiosError();
    error.response = { status: 404 } as AxiosResponse;

    mockedAxios.get.mockRejectedValue(error);

    await expect(gateway.fetchTrips(origin, destination)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw ServerError when the API returns a 500 status", async () => {
    const error = new AxiosError();
    error.response = { status: 500 } as AxiosResponse;

    mockedAxios.get.mockRejectedValue(error);

    await expect(gateway.fetchTrips(origin, destination)).rejects.toThrow(
      ServerError,
    );
  });

  it("should throw ServerError for network errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await expect(gateway.fetchTrips(origin, destination)).rejects.toThrow(
      ServerError,
    );
  });
});

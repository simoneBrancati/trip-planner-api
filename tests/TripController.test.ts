import { getTrips } from "../src/controllers/TripController";
import { HttpTripGateway } from "../src/gateways/HttpGateway";
import { Request, Response } from "express";
import { Trip } from "../src/entities/Trip";

jest.mock("../src/gateways/HttpGateway");

const mockHttpTripGateway = HttpTripGateway as jest.MockedFunction<
  typeof HttpTripGateway
>;

describe("getTrips Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      query: {
        origin: "LAX",
        destination: "ATL",
        sort_by: "cheapest",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should respond with sorted trips", async () => {
    const mockTrips: Trip[] = [
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
    ];

    const fetchTrips = jest.fn().mockResolvedValue(mockTrips);
    mockHttpTripGateway.mockReturnValue({ fetchTrips });

    await getTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        origin: "LAX",
        destination: "ATL",
        cost: 2403,
        duration: 15,
        type: "car",
        id: "87abc816-51bb-4041-a561-10d7bfe0038a",
        display_name: "from LAX to ATL by car",
      },
      {
        origin: "LAX",
        destination: "ATL",
        cost: 4764,
        duration: 14,
        type: "flight",
        id: "653da20d-cbaa-4762-8def-3ed627390d0c",
        display_name: "from LAX to ATL by flight",
      },
    ]);
  });

  it("should call next with an error if fetchTrips throws", async () => {
    const error = new Error("Origin and/or destination must be provided.");

    const fetchTrips = jest.fn().mockRejectedValue(error);
    mockHttpTripGateway.mockReturnValue({ fetchTrips });

    await getTrips(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should call next with an error if query parameters are missing", async () => {
    req.query = {};

    await getTrips(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

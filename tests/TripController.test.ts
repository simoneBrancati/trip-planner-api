import {
  deleteTrip,
  getTrips,
  listSavedTrips,
  saveTrip,
} from "../src/controllers/TripController";
import { HttpTripGateway } from "../src/gateways/HttpGateway";
import { Request, Response } from "express";
import { Trip } from "../src/entities/Trip";
import { RedisCacheGateway } from "../src/gateways/RedisGateway";
import { MongoRepositoryGateway } from "../src/gateways/MongoDbGateway";
import { TripsRepository } from "../src/gateways/TripsRepositoryGateway";

jest.mock("../src/gateways/HttpGateway");
jest.mock("../src/gateways/RedisGateway");

const mockHttpTripGateway = HttpTripGateway as jest.MockedFunction<
  typeof HttpTripGateway
>;
const mockRedisGateway = RedisCacheGateway as jest.MockedFunction<
  typeof RedisCacheGateway
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

    const cacheGet = jest.fn().mockResolvedValue(null);
    const cacheSet = jest.fn().mockResolvedValue(true);
    mockRedisGateway.mockReturnValue({
      get: cacheGet,
      set: cacheSet,
    });

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
    const cacheGet = jest.fn().mockResolvedValue(null);
    const cacheSet = jest.fn().mockResolvedValue(true);
    mockRedisGateway.mockReturnValue({
      get: cacheGet,
      set: cacheSet,
    });

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

jest.mock("../src/gateways/MongoDbGateway");

const mockRepositoryGateway = MongoRepositoryGateway as jest.MockedFunction<
  typeof MongoRepositoryGateway
>;

describe("saveTrip Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        trip: {
          origin: "LAX",
          destination: "ATL",
          cost: 4764,
          duration: 14,
          type: "flight",
          id: "653da20d-cbaa-4762-8def-3ed627390d0c",
          display_name: "from LAX to ATL by flight",
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should respond with saved trip", async () => {
    const mockTrip: Trip = {
      origin: "LAX",
      destination: "ATL",
      cost: 4764,
      duration: 14,
      type: "flight",
      id: "653da20d-cbaa-4762-8def-3ed627390d0c",
      display_name: "from LAX to ATL by flight",
    };

    const save = jest.fn().mockResolvedValue(mockTrip);
    mockRepositoryGateway.mockReturnValue({
      save,
    } as unknown as TripsRepository);

    await saveTrip(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      trip: {
        origin: "LAX",
        destination: "ATL",
        cost: 4764,
        duration: 14,
        type: "flight",
        id: "653da20d-cbaa-4762-8def-3ed627390d0c",
        display_name: "from LAX to ATL by flight",
      },
    });
  });

  it("should call next with an error if body is missing", async () => {
    req.body = {};

    await saveTrip(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("listSavedTrips Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should respond with saved trips", async () => {
    const mockTrips: Trip[] = [
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 6542,
        duration: 6,
        type: "train",
        id: "8bdb00be-9706-481d-80e7-7634dc438b25",
        display_name: "from ATL to LAX by train",
      },
    ];

    const findAll = jest.fn().mockResolvedValue(mockTrips);
    mockRepositoryGateway.mockReturnValue({
      findAll,
    } as unknown as TripsRepository);

    await listSavedTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      trips: mockTrips,
    });
  });
});

describe("deleteTrip Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      query: {
        id: "1234",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should respond with successful deletion", async () => {
    const deleteById = jest.fn().mockResolvedValue(true);
    mockRepositoryGateway.mockReturnValue({
      deleteById,
    } as unknown as TripsRepository);

    await deleteTrip(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Trip with id '1234' deleted successfully",
    });
  });

  it("should respond with a 404 error if trip to delete is not found", async () => {
    const deleteById = jest.fn().mockResolvedValue(false);
    mockRepositoryGateway.mockReturnValue({
      deleteById,
    } as unknown as TripsRepository);

    await deleteTrip(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Trip with id '1234' not found",
    });
  });

  it("should call next with an error if id is missing", async () => {
    req.query = {};

    await deleteTrip(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

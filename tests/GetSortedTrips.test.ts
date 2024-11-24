import { IATACode } from "../src/entities/IATACodes";
import { Trip, SortingStrategy } from "../src/entities/Trip";
import { TripGateway } from "../src/gateways/TripGateway";
import { CacheGateway } from "../src/gateways/CacheGateway";
import { getSortedTrips } from "../src/use_cases/GetSortedTrips";

// This function creates a fake HttpGateway for the 3rd party API that fetches trips
const createMockTripGateway = () => {
  return {
    fetchTrips: jest.fn(),
  } as unknown as TripGateway;
};

// This function creates a fake CacheGateway to fetch trips from the cache
const createMockCacheGateway = () => {
  return {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as CacheGateway;
};

describe("getSortedTrips", () => {
  let mockFetchTrips: jest.Mock;
  let mockTripGateway: TripGateway;
  let mockCacheGet: jest.Mock;
  let mockCacheSet: jest.Mock;
  let mockCacheGateway: CacheGateway;

  beforeEach(() => {
    mockTripGateway = createMockTripGateway();
    mockFetchTrips = mockTripGateway.fetchTrips as jest.Mock;

    mockCacheGateway = createMockCacheGateway();
    mockCacheGet = mockCacheGateway.get as jest.Mock;
    mockCacheSet = mockCacheGateway.set as jest.Mock;
  });

  it("should fetch and sort trips by cost (lowest first)", async () => {
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
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ];

    mockFetchTrips.mockResolvedValue(mockTrips);
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(true);

    const sortedTrips = await getSortedTrips(
      "ATL",
      "LAX",
      "cheapest",
      {
        fetchTrips: mockFetchTrips,
      },
      {
        get: mockCacheGet,
        set: mockCacheSet,
      },
    );

    expect(sortedTrips).toStrictEqual([
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
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
    ]);
  });

  it("should fetch and sort trips by duration (lowest first)", async () => {
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
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ];

    mockFetchTrips.mockResolvedValue(mockTrips);
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(true);

    const sortedTrips = await getSortedTrips(
      "ATL",
      "LAX",
      "fastest",
      {
        fetchTrips: mockFetchTrips,
      },
      {
        get: mockCacheGet,
        set: mockCacheSet,
      },
    );

    expect(sortedTrips).toStrictEqual([
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
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ]);
  });

  it("should fetch and return trips as is if sortBy is not set", async () => {
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
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ];

    mockFetchTrips.mockResolvedValue(mockTrips);
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(true);

    const sortedTrips = await getSortedTrips(
      "ATL",
      "LAX",
      undefined,
      {
        fetchTrips: mockFetchTrips,
      },
      {
        get: mockCacheGet,
        set: mockCacheSet,
      },
    );

    expect(sortedTrips).toStrictEqual([
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
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ]);
  });

  it("should return an empty array if no trips are returned from the Gateway", async () => {
    mockFetchTrips.mockResolvedValue([]);
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(true);

    const sortedTrips = await getSortedTrips(
      "ATL",
      "LAX",
      "fastest",
      {
        fetchTrips: mockFetchTrips,
      },
      {
        get: mockCacheGet,
        set: mockCacheSet,
      },
    );
    expect(sortedTrips).toStrictEqual([]);
  });

  it("should throw an error if missing origin", async () => {
    await expect(
      getSortedTrips(
        "" as IATACode,
        "LAX",
        "fastest" as SortingStrategy,
        {
          fetchTrips: mockFetchTrips,
        },
        {
          get: mockCacheGet,
          set: mockCacheSet,
        },
      ),
    ).rejects.toThrow("Origin and/or destination must be provided.");
  });

  it("should throw an error if missing destination", async () => {
    await expect(
      getSortedTrips(
        "ATL",
        "" as IATACode,
        "fastest" as SortingStrategy,
        {
          fetchTrips: mockFetchTrips,
        },
        {
          get: mockCacheGet,
          set: mockCacheSet,
        },
      ),
    ).rejects.toThrow("Origin and/or destination must be provided.");
  });

  it("should throw an error if an sorting strategy is passed", async () => {
    await expect(
      getSortedTrips(
        "ATL",
        "LAX",
        "bad_value" as SortingStrategy,
        {
          fetchTrips: mockFetchTrips,
        },
        {
          get: mockCacheGet,
          set: mockCacheSet,
        },
      ),
    ).rejects.toThrow('Invalid sorting strategy "bad_value".');
  });
});

import { Trip } from "../src/entities/Trip";
import { CacheGateway } from "../src/gateways/CacheGateway";
import { TripGateway } from "../src/gateways/TripGateway";
import {
  getTripsCacheKey,
  getTripsCacheTtl,
  getCachedTrips,
  fetchTrips,
} from "../src/use_cases/FetchTrips";

describe("getTripsCacheKey", () => {
  it("should generate a cache key", () => {
    const origin = "ATL";
    const destination = "LAX";
    const result = getTripsCacheKey(origin, destination);
    expect(result).toBe("trp-ATL-LAX");
  });
});

describe("getTripsCacheTtl", () => {
  const defaultTtl = 900;

  afterEach(() => {
    delete process.env.CACHE_TTL;
  });

  it("should return the default TTL if CACHE_TTL is not set", () => {
    const ttl = getTripsCacheTtl(defaultTtl);
    expect(ttl).toBe(defaultTtl);
  });

  it("should return the env value if is CACHE_TTL is set as a valid number", () => {
    process.env.CACHE_TTL = "1200";
    const ttl = getTripsCacheTtl(defaultTtl);
    expect(ttl).toBe(1200);
  });

  it("should return the default TTL if CACHE_TTL is not a valid number", () => {
    process.env.CACHE_TTL = "not a valid number";
    const ttl = getTripsCacheTtl(defaultTtl);
    expect(ttl).toBe(defaultTtl);
  });

  it("should return the default TTL if CACHE_TTL is an empty string", () => {
    process.env.CACHE_TTL = "";
    const ttl = getTripsCacheTtl(defaultTtl);
    expect(ttl).toBe(defaultTtl);
  });

  it("should return the default TTL of 600 when no CACHE_TTL is set and no defaultTtl is provided", () => {
    const ttl = getTripsCacheTtl();
    expect(ttl).toBe(600);
  });
});

describe("getCachedTrips", () => {
  let mockCacheGateway: jest.Mocked<CacheGateway>;

  beforeEach(() => {
    mockCacheGateway = {
      get: jest.fn(),
      set: jest.fn(),
    };
  });

  it("should return null if cache returns null", async () => {
    mockCacheGateway.get.mockResolvedValue(null);
    const result = await getCachedTrips(mockCacheGateway, "test-key");
    expect(result).toBeNull();
  });

  it("should return trips if cache returns valid JSON", async () => {
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
    mockCacheGateway.get.mockResolvedValue(JSON.stringify(mockTrips));

    const result = await getCachedTrips(mockCacheGateway, "test-key");
    expect(result).toEqual(mockTrips);
  });

  it("should return null if cache returns invalid JSON", async () => {
    mockCacheGateway.get.mockResolvedValue("invalid JSON");
    const result = await getCachedTrips(mockCacheGateway, "test-key");
    expect(result).toBeNull();
  });

  it("should return null if cache returns an empty string", async () => {
    mockCacheGateway.get.mockResolvedValue("");
    const result = await getCachedTrips(mockCacheGateway, "test-key");
    expect(result).toBeNull();
  });
});

describe("fetchTrips", () => {
  let mockCacheGateway: jest.Mocked<CacheGateway>;
  let mockTripGateway: jest.Mocked<TripGateway>;

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

  beforeEach(() => {
    mockCacheGateway = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockTripGateway = {
      fetchTrips: jest.fn(),
    };
  });

  it("should return cached trips if they exist", async () => {
    mockCacheGateway.get.mockResolvedValue(JSON.stringify(mockTrips));

    const result = await fetchTrips(
      mockCacheGateway,
      mockTripGateway,
      "ATL",
      "LAX",
    );

    expect(result).toEqual(mockTrips);
    expect(mockCacheGateway.get).toHaveBeenCalledWith("trp-ATL-LAX");
    expect(mockTripGateway.fetchTrips).not.toHaveBeenCalled();
  });

  it("should fetch trips from 3rd party api if cache is empty and cache them", async () => {
    mockCacheGateway.get.mockResolvedValue(null);
    mockTripGateway.fetchTrips.mockResolvedValue(mockTrips);

    const result = await fetchTrips(
      mockCacheGateway,
      mockTripGateway,
      "ATL",
      "LAX",
    );

    expect(result).toEqual(mockTrips);
    expect(mockCacheGateway.get).toHaveBeenCalledWith("trp-ATL-LAX");
    expect(mockCacheGateway.set).toHaveBeenCalledWith(
      "trp-ATL-LAX",
      JSON.stringify(mockTrips),
      600,
    );
  });

  it("should throw an error if tripGateway fails", async () => {
    mockCacheGateway.get.mockResolvedValue(null);
    mockTripGateway.fetchTrips.mockRejectedValue(
      new Error("Error in TripGateway"),
    );

    await expect(
      fetchTrips(mockCacheGateway, mockTripGateway, "ATL", "LAX"),
    ).rejects.toThrow("Error in TripGateway");

    expect(mockCacheGateway.get).toHaveBeenCalledWith("trp-ATL-LAX");
    expect(mockTripGateway.fetchTrips).toHaveBeenCalledWith("ATL", "LAX");
    expect(mockCacheGateway.set).not.toHaveBeenCalled();
  });
});

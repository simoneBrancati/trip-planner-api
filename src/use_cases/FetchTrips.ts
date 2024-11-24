import { IATACode } from "../entities/IATACodes";
import { Trip } from "../entities/Trip";
import { CacheGateway } from "../gateways/CacheGateway";
import { TripGateway } from "../gateways/TripGateway";

/**
 * Fetches trips either from the cache or the 3rd party API.
 *
 * @param cacheGateway Cache Gateway instance.
 * @param tripGateway Trip Gateway instance.
 * @param origin - Origin IATA code.
 * @param destination - Destination IATA code.
 * @returns An array of trips
 */
export const fetchTrips = async (
  cacheGateway: CacheGateway,
  tripGateway: TripGateway,
  origin: IATACode,
  destination: IATACode,
): Promise<Trip[]> => {
  const cacheKey = getTripsCacheKey(origin, destination);

  const cachedTrips = await getCachedTrips(cacheGateway, cacheKey);

  if (cachedTrips) {
    return cachedTrips;
  }

  const trips = await tripGateway.fetchTrips(origin, destination);

  const ttl = getTripsCacheTtl();
  cacheGateway.set(cacheKey, JSON.stringify(trips), ttl);

  return trips;
};

/**
 * Gets trips stored from the cache at a specific key.
 *
 * @param cacheGateway Cache Gateway instance.
 * @param cacheKey Key to cache the trips for an origin and a destination.
 * @returns Trips stored in the cache.
 */
export const getCachedTrips = async (
  cacheGateway: CacheGateway,
  cacheKey: string,
): Promise<Trip[] | null> => {
  const cachedTrips = await cacheGateway.get(cacheKey);
  if (!cachedTrips) {
    return null;
  }

  try {
    const parsed = JSON.parse(cachedTrips);
    return parsed || null;
  } catch {
    return null;
  }
};

/**
 * Creates a unique key for the origin and destinations codes.
 *
 * @param origin - Origin IATA code.
 * @param destination - Destination IATA code.
 * @returns a key to identify the values to cache.
 */
export const getTripsCacheKey = (origin: IATACode, destination: IATACode) => {
  return `trp-${origin}-${destination}`;
};

/**
 * Obtains the ttl in seconds for the caching system.
 *
 * @param defaultTtl Default value for cache TTL.
 * @returns The ttl to use for the cache.
 */
export const getTripsCacheTtl = (defaultTtl = 600) => {
  if (!process.env.CACHE_TTL) {
    return defaultTtl;
  }

  const parsed = parseInt(process.env.CACHE_TTL);

  return !Number.isNaN(parsed) ? parsed : defaultTtl;
};

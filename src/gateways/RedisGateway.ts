import { CacheGateway } from "./CacheGateway";
import { Redis } from "ioredis";

/**
 * Creates a Redis Cache Gateway instance
 *
 * @returns The CacheGateway module with `get` and `set` methods
 */
export const RedisCacheGateway = (): CacheGateway => {
  const client = createClient();

  /**
   * Reads the value from Redis by key.
   *
   * @param key The key of the cached value
   * @returns The cached value or null if not found
   */
  const get = async (key: string): Promise<string | null> => {
    const cachedData = await client.get(key);
    return cachedData || null;
  };

  /**
   * Sets the value in Redis with the specified TTL (time-to-live).
   *
   * @param key The key for the cache
   * @param value The string value to cache
   * @param ttl Time-to-live in seconds
   */
  const set = async (
    key: string,
    value: string,
    ttl?: number,
  ): Promise<boolean> => {
    if (ttl) {
      const response = await client.set(key, value, "EX", ttl);

      return response === "OK";
    }

    const response = await client.set(key, value);

    return response === "OK";
  };

  return {
    get,
    set,
  };
};

/**
 * Creates an instance of Redis client.
 *
 * @returns Redis client
 */
export const createClient = (): Redis => {
  if (
    !process.env.REDIS_HOST ||
    !process.env.REDIS_PORT ||
    Number.isNaN(parseInt(process.env.REDIS_PORT))
  ) {
    throw new Error("Redis configuration missing!");
  }

  return new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  });
};

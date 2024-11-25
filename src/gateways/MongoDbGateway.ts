import { MongoClient, ObjectId } from "mongodb";
import { Trip } from "../entities/Trip";
import ServerError from "../errors/ServerError";
import { TripsRepository } from "./TripsRepositoryGateway";

/**
 * Creates a MongoDB Repository Gateway.
 *
 * @returns An instance of the MongoRepositoryGateway.
 */
export const MongoRepositoryGateway = (): TripsRepository => {
  const save = async (trip: Trip): Promise<Trip> => {
    await connect();
    const result = await getCollection().insertOne(trip);
    if (!result.insertedId) {
      throw new ServerError("Failed to save trip");
    }

    return trip;
  };

  const findAll = async (): Promise<Trip[]> => {
    await connect();
    return getCollection().find<Trip>({}).toArray();
  };

  const deleteById = async (id: string): Promise<boolean> => {
    await connect();
    const result = await getCollection().deleteOne({ id });
    return result.deletedCount === 1;
  };

  return {
    save,
    findAll,
    deleteById,
  };
};

let client: MongoClient;
const getClient = () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing mongodb configuration");
  }

  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
  }

  return client;
};

const getCollection = () => {
  if (!process.env.TRIPS_MONGO_DBNAME || !process.env.TRIPS_MONGO_COLLNAME) {
    throw new Error("Missing mongodb configuration");
  }

  return getClient()
    .db(process.env.TRIPS_MONGO_DBNAME)
    .collection(process.env.TRIPS_MONGO_COLLNAME);
};

let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await getClient().connect();
    isConnected = true;
  }
};

export interface TripDocument extends Trip {
  _id: ObjectId;
}

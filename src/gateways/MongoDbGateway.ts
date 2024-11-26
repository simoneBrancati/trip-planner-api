import { MongoClient, MongoServerError } from "mongodb";
import { Trip } from "../entities/Trip";
import { TripsRepository } from "./TripsRepositoryGateway";
import ConflictError from "../errors/ConflictError";

/**
 * Creates a MongoDB Repository Gateway.
 *
 * @returns An instance of the MongoRepositoryGateway.
 */
export const MongoRepositoryGateway = (): TripsRepository => {
  const save = async (trip: Trip): Promise<Trip> => {
    await connect();
    try {
      await getCollection().insertOne({
        ...trip,
        _id: trip.id,
      });
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictError("A trip with the same ID already exists.");
      }

      throw err;
    }

    return trip;
  };

  const findAll = async (): Promise<Trip[]> => {
    await connect();
    const tripDocuments = await getCollection()
      .find<TripDocument>({})
      .toArray();

    return tripDocuments.map((doc) => {
      return {
        origin: doc.origin,
        destination: doc.destination,
        cost: doc.cost,
        duration: doc.duration,
        type: doc.type,
        id: doc.id,
        display_name: doc.display_name,
      };
    });
  };

  const deleteById = async (id: string): Promise<boolean> => {
    await connect();
    const result = await getCollection().deleteOne({ _id: id });
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
    .collection<TripDocument>(process.env.TRIPS_MONGO_COLLNAME);
};

let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await getClient().connect();
    isConnected = true;
  }
};

export interface TripDocument extends Trip {
  _id: string;
}

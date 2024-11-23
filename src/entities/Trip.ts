import { IATACode } from "./IATACodes";

export interface Trip {
  origin: IATACode;
  destination: IATACode;
  cost: number;
  duration: number;
  type: TripType;
  id: string;
  display_name: string;
}

type TripType = "flight" | "train" | "car";

export type SortingStrategy = "fastest" | "cheapest";

export type SortingFunction = (trip: Trip[]) => Trip[];

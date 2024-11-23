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

enum TripType {
  flight = "flight",
}

export interface Trip {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: TripType;
  id: string;
  display_name: string;
}

enum TripType {
  flight = "flight",
}

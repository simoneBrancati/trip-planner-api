import { IATACode } from "../entities/IATACodes";
import { SortingStrategy, Trip } from "../entities/Trip";

export const validateIATACode = (code: unknown): code is IATACode => {
  return !!code && typeof code === "string" && IATACodesArray.includes(code);
};

export const validateSortingStrategy = (
  sort: unknown,
): sort is SortingStrategy => {
  return (
    !!sort && typeof sort === "string" && SortingStrategiesArray.includes(sort)
  );
};

export const validateTrip = (trip: unknown): trip is Trip => {
  if (!trip || typeof trip !== "object") {
    return false;
  }

  const maybeTrip = trip as Record<string, unknown>;
  return (
    validateIATACode(maybeTrip.origin) &&
    validateIATACode(maybeTrip.destination) &&
    isPositiveNumber(maybeTrip.cost) &&
    isPositiveNumber(maybeTrip.duration) &&
    validateTripType(maybeTrip.type) &&
    isNonEmptyString(maybeTrip.id) &&
    isNonEmptyString(maybeTrip.display_name)
  );
};

export const validateTripType = (value: unknown) => {
  return isNonEmptyString(value) && tripTypes.includes(value);
};

export const isNonEmptyString = (value: unknown): value is string => {
  return !!value && typeof value === "string";
};

export const isPositiveNumber = (value: unknown): value is number => {
  return (
    typeof value === "number" && !isNaN(value) && isFinite(value) && value >= 0
  );
};

const IATACodesArray = [
  "ATL",
  "PEK",
  "LAX",
  "DXB",
  "HND",
  "ORD",
  "LHR",
  "PVG",
  "CDG",
  "DFW",
  "AMS",
  "FRA",
  "IST",
  "CAN",
  "JFK",
  "SIN",
  "DEN",
  "ICN",
  "BKK",
  "SFO",
  "LAS",
  "CLT",
  "MIA",
  "KUL",
  "SEA",
  "MUC",
  "EWR",
  "MAD",
  "HKG",
  "MCO",
  "PHX",
  "IAH",
  "SYD",
  "MEL",
  "GRU",
  "YYZ",
  "LGW",
  "BCN",
  "MAN",
  "BOM",
  "DEL",
  "ZRH",
  "SVO",
  "DME",
  "JNB",
  "ARN",
  "OSL",
  "CPH",
  "HEL",
  "VIE",
];

const SortingStrategiesArray = ["fastest", "cheapest"];

const tripTypes = ["train", "flight", "car"];

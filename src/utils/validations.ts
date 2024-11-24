import { IATACode } from "../entities/IATACodes";
import { SortingStrategy } from "../entities/Trip";

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

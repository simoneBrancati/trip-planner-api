import { SortingStrategy } from "../src/entities/Trip";
import {
  validateIATACode,
  validateSortingStrategy,
} from "../src/utils/validations";

describe("validateIATACode", () => {
  it("should return true for valid IATA codes", () => {
    expect(validateIATACode("ATL")).toBe(true);
  });

  it("should return false for invalid IATA codes", () => {
    expect(validateIATACode("XYZ")).toBe(false);
  });

  it("should return false for values that are not strings", () => {
    const nonStringValues = [123, true, {}, [], null, undefined, Symbol("ATL")];
    nonStringValues.forEach((value) => {
      expect(validateIATACode(value)).toBe(false);
    });
  });

  it("Edge cases: should return false", () => {
    const edgeCases = ["", " ", "ATL ", "atl"];
    edgeCases.forEach((value) => {
      expect(validateIATACode(value)).toBe(false);
    });
  });
});

describe("validateSortingStrategy", () => {
  it("should return true for valid sorting strategies", () => {
    const validStrategies: SortingStrategy[] = ["cheapest", "fastest"];
    validStrategies.forEach((strategy) => {
      expect(validateSortingStrategy(strategy)).toBe(true);
    });
  });

  it("should return false for invalid sorting strategies", () => {
    const invalidStrategies = ["expensive", "slowest", ""];
    invalidStrategies.forEach((strategy) => {
      expect(validateSortingStrategy(strategy)).toBe(false);
    });
  });

  it("should return false for non-string values", () => {
    const nonStringValues = [
      123,
      true,
      {},
      [],
      Symbol("expensive"),
      null,
      undefined,
    ];
    nonStringValues.forEach((value) => {
      expect(validateSortingStrategy(value)).toBe(false);
    });
  });

  it("Edge cases: should return false", () => {
    const edgeCases = [" cheapest", " fastest", "FASTEST"];
    edgeCases.forEach((value) => {
      expect(validateSortingStrategy(value)).toBe(false);
    });
  });
});

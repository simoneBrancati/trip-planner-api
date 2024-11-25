import { SortingStrategy, Trip } from "../src/entities/Trip";
import {
  isPositiveNumber,
  isNonEmptyString,
  validateIATACode,
  validateSortingStrategy,
  validateTripType,
  validateTrip,
} from "../src/utils/Validations";

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

describe("validateTripType", () => {
  it("should return true for valid trip types", () => {
    const values = ["car", "flight", "train"];

    values.forEach((value) => {
      expect(validateTripType(value)).toBe(true);
    });
  });

  it("should return false for invalid trip type", () => {
    expect(validateTripType("asdfa")).toBe(false);
  });

  it("should return false for values that are not strings", () => {
    const nonStringValues = [123, true, {}, [], null, undefined, Symbol("ATL")];
    nonStringValues.forEach((value) => {
      expect(validateTripType(value)).toBe(false);
    });
  });

  it("Edge cases: should return false", () => {
    const edgeCases = ["", " ", "car ", "FLIGHT"];
    edgeCases.forEach((value) => {
      expect(validateTripType(value)).toBe(false);
    });
  });
});

describe("isNonEmptyString", () => {
  test("should return true for a valid string", () => {
    expect(isNonEmptyString("hello")).toBe(true);
  });

  test("should return false for an empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  test("should return false for non-string values", () => {
    const nonStringValues = [null, undefined, 123, {}, [], false];

    nonStringValues.forEach((value) => {
      expect(isNonEmptyString(value)).toBe(false);
    });
  });
});

describe("isPositiveNumber", () => {
  test("should return true for valid positive numbers", () => {
    const values = [21, 0, 35.23];

    values.forEach((value) => {
      expect(isPositiveNumber(value)).toBe(true);
    });
  });

  test("should return true for negative numbers", () => {
    const values = [-12, -35.23];

    values.forEach((value) => {
      expect(isPositiveNumber(value)).toBe(false);
    });
  });

  test("should return false for invalid numbers", () => {
    const values = [NaN, Infinity, -Infinity];

    values.forEach((value) => {
      expect(isPositiveNumber(value)).toBe(false);
    });
  });

  test("should return false for non-number values", () => {
    const nonNumberValues = [null, undefined, "123", {}, [], false];

    nonNumberValues.forEach((value) => {
      expect(isPositiveNumber(value)).toBe(false);
    });
  });
});

describe("validateTrip", () => {
  test("returns true for a valid trip", () => {
    const validTrip: Trip = {
      origin: "ATL",
      destination: "LAX",
      cost: 6542,
      duration: 6,
      type: "train",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: "from ATL to LAX by train",
    };

    expect(validateTrip(validTrip)).toBe(true);
  });

  test("returns false for missing required fields", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid origin and destination IATA codes", () => {
    const invalidTrip = {
      origin: "CTA",
      destination: "CIY",
      cost: 6542,
      duration: 6,
      type: "train",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: "from CTA to CIY by train",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid cost", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
      cost: -6542,
      duration: 6,
      type: "train",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: "from CTA to CIY by train",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid duration", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
      cost: 6542,
      duration: "six hours",
      type: "train",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: "from CTA to CIY by train",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid trip type", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
      cost: 6542,
      duration: 6,
      type: "airship",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: "from CTA to CIY by airship",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid id", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
      cost: 6542,
      duration: 6,
      type: "train",
      id: "",
      display_name: "from ATL to LAX by train",
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for invalid display name", () => {
    const invalidTrip = {
      origin: "ATL",
      destination: "LAX",
      cost: 6542,
      duration: 6,
      type: "train",
      id: "8bdb00be-9706-481d-80e7-7634dc438b25",
      display_name: 12345,
    };

    expect(validateTrip(invalidTrip)).toBe(false);
  });

  test("returns false for non-object values", () => {
    expect(validateTrip(null)).toBe(false);
    expect(validateTrip(undefined)).toBe(false);
    expect(validateTrip("not-an-object")).toBe(false);
    expect(validateTrip(123)).toBe(false);
  });
});

import { Trip } from "../src/entities/Trip";
import { sortByCheapest, sortByFastest } from "../src/use_cases/TripSorting";

describe("sortByCheapest", () => {
  it("should sort trips with lower cost first", () => {
    const mockTrips: Trip[] = [
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 6542,
        duration: 6,
        type: "train",
        id: "8bdb00be-9706-481d-80e7-7634dc438b25",
        display_name: "from ATL to LAX by train",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ];

    const result = sortByCheapest(mockTrips);
    expect(result).toEqual([
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 6542,
        duration: 6,
        type: "train",
        id: "8bdb00be-9706-481d-80e7-7634dc438b25",
        display_name: "from ATL to LAX by train",
      },
    ]);
  });

  it("should return an empty array when given an empty array", () => {
    const emptyTrips: Trip[] = [];
    expect(sortByCheapest(emptyTrips)).toEqual([]);
  });

  it("should return the same array given as input when there is only one element", () => {
    const mockTrips: Trip[] = [
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
    ];

    expect(sortByCheapest(mockTrips)).toEqual([
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
    ]);
  });
});

describe("sortByFastest", () => {
  it("should sort trips with lower duration first", () => {
    const mockTrips: Trip[] = [
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 6542,
        duration: 6,
        type: "train",
        id: "8bdb00be-9706-481d-80e7-7634dc438b25",
        display_name: "from ATL to LAX by train",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ];

    const result = sortByFastest(mockTrips);
    expect(result).toEqual([
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 6542,
        duration: 6,
        type: "train",
        id: "8bdb00be-9706-481d-80e7-7634dc438b25",
        display_name: "from ATL to LAX by train",
      },
      {
        origin: "ATL",
        destination: "LAX",
        cost: 2806,
        duration: 13,
        type: "car",
        id: "4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438",
        display_name: "from ATL to LAX by car",
      },
    ]);
  });

  it("should return an empty array when given an empty array", () => {
    const emptyTrips: Trip[] = [];
    expect(sortByFastest(emptyTrips)).toEqual([]);
  });

  it("should return the same array given as input when there is only one element", () => {
    const mockTrips: Trip[] = [
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
    ];
    expect(sortByFastest(mockTrips)).toEqual([
      {
        origin: "ATL",
        destination: "LAX",
        cost: 5351,
        duration: 4,
        type: "flight",
        id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
        display_name: "from ATL to LAX by flight",
      },
    ]);
  });
});

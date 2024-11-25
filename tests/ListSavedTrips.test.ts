import { Trip } from "../src/entities/Trip";
import { TripsRepository } from "../src/gateways/TripsRepositoryGateway";
import { listSavedTrips } from "../src/use_cases/ListSavedTrips";

const createMockTripsRepository = () => {
  return {
    findAll: jest.fn(),
  } as unknown as TripsRepository;
};

describe("listSavedTrips", () => {
  let mockFindAll: jest.Mock;
  let mockTripsRepository: TripsRepository;

  beforeEach(() => {
    mockTripsRepository = createMockTripsRepository();
    mockFindAll = mockTripsRepository.findAll as jest.Mock;
  });

  it("should return saved trips", async () => {
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
    ];

    mockFindAll.mockResolvedValue(mockTrips);

    const trips = await listSavedTrips({
      findAll: mockFindAll,
    } as unknown as TripsRepository);

    expect(trips).toStrictEqual(mockTrips);
  });

  it("should return an empty array if there are no saved trips", async () => {
    mockFindAll.mockResolvedValue([]);

    const trips = await listSavedTrips({
      findAll: mockFindAll,
    } as unknown as TripsRepository);

    expect(trips).toStrictEqual([]);
  });
});

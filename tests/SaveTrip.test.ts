import { Trip } from "../src/entities/Trip";
import { TripsRepository } from "../src/gateways/TripsRepositoryGateway";
import { saveTrip } from "../src/use_cases/SaveTrip";

const createMockTripsRepository = () => {
  return {
    save: jest.fn(),
  } as unknown as TripsRepository;
};

describe("getSortedTrips", () => {
  let mockSave: jest.Mock;
  let mockTripsRepository: TripsRepository;

  beforeEach(() => {
    mockTripsRepository = createMockTripsRepository();
    mockSave = mockTripsRepository.save as jest.Mock;
  });

  it("should save a trip and return it", async () => {
    const mockTrip: Trip = {
      origin: "ATL",
      destination: "LAX",
      cost: 5351,
      duration: 4,
      type: "flight",
      id: "9d229cdc-906b-4fcc-b6d0-f672e8581376",
      display_name: "from ATL to LAX by flight",
    };

    mockSave.mockResolvedValue(mockTrip);

    const savedTrip = await saveTrip(mockTrip, {
      save: mockSave,
    } as unknown as TripsRepository);

    expect(savedTrip).toStrictEqual(mockTrip);
  });

  it("should fail on validation", async () => {
    const mockInvalidTrip = {
      origin: "CTA",
      destination: "Paris",
      cost: -5351,
      duration: -4,
      type: "on foot",
      id: "",
      display_name: 1234,
    } as unknown as Trip;
    await expect(
      saveTrip(mockInvalidTrip, {
        save: mockSave,
      } as unknown as TripsRepository),
    ).rejects.toThrow("Trip to save is not valid");
  });
});

import { TripsRepository } from "../src/gateways/TripsRepositoryGateway";
import { deleteTrip } from "../src/use_cases/DeleteTrip";

const createMockTripsRepository = () => {
  return {
    deleteById: jest.fn(),
  } as unknown as TripsRepository;
};

describe("deleteTrip", () => {
  let mockDeleteById: jest.Mock;
  let mockTripsRepository: TripsRepository;

  beforeEach(() => {
    mockTripsRepository = createMockTripsRepository();
    mockDeleteById = mockTripsRepository.deleteById as jest.Mock;
  });

  it("should delete a trip and return true", async () => {
    mockDeleteById.mockResolvedValue(true);

    const id = "1234";

    const success = await deleteTrip(id, {
      deleteById: mockDeleteById,
    } as unknown as TripsRepository);

    expect(success).toBe(true);
  });

  it("should try delete a trip that is not found in the database", async () => {
    mockDeleteById.mockResolvedValue(false);

    const id = "1234";

    const success = await deleteTrip(id, {
      deleteById: mockDeleteById,
    } as unknown as TripsRepository);

    expect(success).toBe(false);
  });

  it("should fail on validation", async () => {
    const mockInvalidIds = ["", null, undefined, 123, {}, [], false];

    for await (const id of mockInvalidIds) {
      await expect(
        deleteTrip(
          id as string,
          {
            deleteById: mockDeleteById,
          } as unknown as TripsRepository,
        ),
      ).rejects.toThrow("Trip id to delete is not valid");
    }
  });
});

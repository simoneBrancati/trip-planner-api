export interface RepositoryGateway<T> {
  /**
   * Saves an entity in the repository.
   *
   * @param entity - The entity to save.
   * @returns The saved entity.
   */
  save(entity: T): Promise<T>;

  /**
   * Finds all entities in the repository.
   *
   * @returns An array of all entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Deletes an entity by its ID.
   *
   * @param id - The ID of the entity to delete.
   * @returns True if deletion was successful, false otherwise.
   */
  deleteById(id: string): Promise<boolean>;
}

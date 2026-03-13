import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStory } from "../../domain/entities/UserStory";
import { Result } from "../../domain/shared/Result";

export const getStoriesUseCase = async (
  repository: IUserStoryRepository
): Promise<Result<UserStory[]>> => {
  // El repositorio ya devuelve un Result, solo lo retornamos.
  return repository.findAll();
};

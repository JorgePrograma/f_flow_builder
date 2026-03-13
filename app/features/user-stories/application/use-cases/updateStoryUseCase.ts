import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStory } from "../../domain/entities/UserStory";
import { Result } from "../../domain/shared/Result";

export const updateStoryUseCase = async (
  repository: IUserStoryRepository,
  story: UserStory
): Promise<Result<void>> => {
  return repository.save(story);
};

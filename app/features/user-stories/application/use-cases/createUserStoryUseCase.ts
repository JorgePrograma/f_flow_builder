import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStory } from "../../domain/entities/UserStory";
import { Result, ok } from "../../domain/shared/Result";

type CreateUserStoryInput = Omit<UserStory, 'id' | 'createdAt'>;

export const createUserStoryUseCase = async (
  repository: IUserStoryRepository,
  input: CreateUserStoryInput
): Promise<Result<UserStory>> => {
  const story: UserStory = {
    ...input,
    id: `US-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  const result = await repository.save(story);
  
  if (!result.ok) {
    return result;
  }

  return ok(story);
};

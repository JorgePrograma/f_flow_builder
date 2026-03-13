import { UserStory } from "../entities/UserStory";
import { Result } from "../shared/Result";

export interface IUserStoryRepository {
  findAll(): Promise<Result<UserStory[]>>;
  findById(id: string): Promise<Result<UserStory | null>>;
  save(story: UserStory): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}

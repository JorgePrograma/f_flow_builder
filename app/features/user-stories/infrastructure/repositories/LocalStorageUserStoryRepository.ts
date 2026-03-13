import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStory } from "../../domain/entities/UserStory";
import { UserStoryMapper } from "../mappers/UserStoryMapper";
import { Result, ok, fail } from "../../domain/shared/Result";

const LOCAL_STORAGE_KEY = 'sf_stories';

export class LocalStorageUserStoryRepository implements IUserStoryRepository {
  async findAll(): Promise<Result<UserStory[]>> {
    try {
      if (typeof window === 'undefined') return ok([]);
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) return ok([]);
      
      const parsed = JSON.parse(data);
      const stories = Array.isArray(parsed) 
        ? parsed.map(UserStoryMapper.toDomain)
        : [];
      return ok(stories);
    } catch (error) {
      return fail(new Error("Error al leer de LocalStorage"));
    }
  }

  async findById(id: string): Promise<Result<UserStory | null>> {
    const result = await this.findAll();
    if (!result.ok) return result;
    
    const story = result.value.find(s => s.id === id) || null;
    return ok(story);
  }

  async save(story: UserStory): Promise<Result<void>> {
    try {
      if (typeof window === 'undefined') return ok(undefined);
      
      const result = await this.findAll();
      if (!result.ok) return result;
      
      const stories = result.value;
      const index = stories.findIndex(s => s.id === story.id);
      
      if (index >= 0) {
        stories[index] = story;
      } else {
        stories.push(story);
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
      return ok(undefined);
    } catch (error) {
      return fail(new Error("Error al guardar en LocalStorage"));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      if (typeof window === 'undefined') return ok(undefined);
      
      const result = await this.findAll();
      if (!result.ok) return result;
      
      const filtered = result.value.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return ok(undefined);
    } catch (error) {
      return fail(new Error("Error al eliminar de LocalStorage"));
    }
  }
}

export const makeUserStoryRepository = (): IUserStoryRepository => {
  return new LocalStorageUserStoryRepository();
};

import { UserStory } from "../../domain/entities/UserStory";
import { ExportService } from "../../../../shared/services/ExportService";
import { Result, fail } from "../../domain/shared/Result";

export const exportStoriesUseCase = async (
  stories: UserStory[],
  filename: string
): Promise<Result<void>> => {
    if (stories.length === 0) {
      return fail(new Error("No hay historias para exportar"));
    }
    return await ExportService.exportStoriesToDocx(stories, filename);
};

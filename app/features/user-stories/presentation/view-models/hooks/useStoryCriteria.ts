import { UserStory } from "../../../domain/entities/UserStory";
import { ICollectionStrategy, StoryCollection } from "./types";

export const useStoryCriteria = (
  activeStory: UserStory | null,
  updateField: <K extends keyof UserStory>(field: K, value: UserStory[K]) => void,
  colStrategy: ICollectionStrategy
) => {
  const updateCriteria = (fn: (items: UserStory[typeof StoryCollection.CRITERIA]) => UserStory[typeof StoryCollection.CRITERIA]) => {
    if (!activeStory) return;
    updateField(StoryCollection.CRITERIA, fn(activeStory.criteria));
  };

  return {
    handleAddCriteria: () => updateCriteria((items) => colStrategy.add(items, "")),
    handleUpdateCriteria: (i: number, v: string) => updateCriteria((items) => colStrategy.update(items, i, v)),
    handleRemoveCriteria: (i: number) => updateCriteria((items) => colStrategy.remove(items, i, [""])),
  };
};

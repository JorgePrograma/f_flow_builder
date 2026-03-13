import { UserStory, TechnicalLayer } from "../../../domain/entities/UserStory";
import { ICollectionStrategy, StoryCollection } from "./types";

export const useStoryTasks = (
  activeStory: UserStory | null,
  updateField: <K extends keyof UserStory>(field: K, value: UserStory[K]) => void,
  colStrategy: ICollectionStrategy
) => {
  const updateTasks = (fn: (items: UserStory[typeof StoryCollection.TASKS]) => UserStory[typeof StoryCollection.TASKS]) => {
    if (!activeStory) return;
    updateField(StoryCollection.TASKS, fn(activeStory.tasks));
  };

  return {
    handleAddTask: () => updateTasks((items) => colStrategy.add(items, { text: "", layer: "backend" })),
    handleUpdateTaskText: (i: number, text: string) => updateTasks((items) => colStrategy.update(items, i, { text })),
    handleUpdateTaskLayer: (i: number, layer: TechnicalLayer) => updateTasks((items) => colStrategy.update(items, i, { layer })),
    handleRemoveTask: (i: number) => updateTasks((items) => colStrategy.remove(items, i, [{ text: "", layer: "backend" }])),
    handleReorderTasks: (s: number, e: number) => updateTasks((items) => colStrategy.reorder(items, s, e)),
  };
};

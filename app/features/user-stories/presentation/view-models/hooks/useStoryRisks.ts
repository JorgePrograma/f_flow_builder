import { UserStory, RiskLevel } from "../../../domain/entities/UserStory";
import { ICollectionStrategy, StoryCollection } from "./types";

export const useStoryRisks = (
  activeStory: UserStory | null,
  updateField: <K extends keyof UserStory>(field: K, value: UserStory[K]) => void,
  colStrategy: ICollectionStrategy
) => {
  const updateRisks = (fn: (items: UserStory[typeof StoryCollection.RISKS]) => UserStory[typeof StoryCollection.RISKS]) => {
    if (!activeStory) return;
    updateField(StoryCollection.RISKS, fn(activeStory.risks));
  };

  return {
    handleAddRisk: () => updateRisks((items) => colStrategy.add(items, { level: "medio", text: "" })),
    handleUpdateRiskText: (i: number, text: string) => updateRisks((items) => colStrategy.update(items, i, { text })),
    handleUpdateRiskLevel: (i: number, level: RiskLevel) => updateRisks((items) => colStrategy.update(items, i, { level })),
    handleRemoveRisk: (i: number) => updateRisks((items) => colStrategy.remove(items, i, [{ level: "medio", text: "" }])),
  };
};

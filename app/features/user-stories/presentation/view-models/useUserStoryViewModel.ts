import { useCallback, useEffect, useMemo } from "react";
import { useUserStoryStore } from "../store/userStoryStore";
import { getStoriesUseCase } from "../../application/use-cases/getStoriesUseCase";
import { createUserStoryUseCase } from "../../application/use-cases/createUserStoryUseCase";
import { updateStoryUseCase } from "../../application/use-cases/updateStoryUseCase";
import { exportStoriesUseCase } from "../../application/use-cases/exportStoriesUseCase";
import { UserStory, StoryStatus, StoryTechnicalLayer, StoryRiskLevel } from "../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { FibonacciEstimationStrategy, IEstimationStrategy } from "../../domain/strategies/EstimationStrategy";

// Hooks especializados
import { useStoryTasks } from "./hooks/useStoryTasks";
import { useStoryCriteria } from "./hooks/useStoryCriteria";
import { useStoryRisks } from "./hooks/useStoryRisks";
import { ICollectionStrategy } from "./hooks/types";

// Estrategia de Colección (Shared)
const colStrategy: ICollectionStrategy = {
  add: <T>(items: T[], newItem: T): T[] => [...items, newItem],
  remove: <T>(items: T[], idx: number, min: T[]): T[] => {
    const next = items.filter((_, i) => i !== idx);
    return next.length ? next : min;
  },
  update: <T>(items: T[], idx: number, patch: Partial<T> | T): T[] => {
    const next = [...items];
    const current = next[idx];
    if (typeof patch === 'object' && patch !== null && !Array.isArray(patch) && typeof current === 'object') {
      next[idx] = { ...current, ...patch };
    } else next[idx] = patch as T;
    return next;
  },
  reorder: <T>(items: T[], start: number, end: number): T[] => {
    const next = [...items];
    const [removed] = next.splice(start, 1);
    next.splice(end, 0, removed);
    return next;
  }
};

export const useUserStoryViewModel = (
  repository: IUserStoryRepository, 
  estimationStrategy: IEstimationStrategy = new FibonacciEstimationStrategy()
) => {
  const stories = useUserStoryStore((s) => s.stories);
  const activeId = useUserStoryStore((s) => s.activeId);
  const isLoading = useUserStoryStore((s) => s.isLoading);
  const { setStories, setActiveId, setLoading, setError } = useUserStoryStore();

  const loadStories = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const result = await getStoriesUseCase(repository);
    if (result.ok) setStories(result.value); else setError(result.error.message);
    if (showLoading) setLoading(false);
  }, [repository, setStories, setLoading, setError]);

  useEffect(() => { loadStories(); }, [loadStories]);

  const activeStory = useMemo(() => stories.find(s => s.id === activeId) || null, [stories, activeId]);

  const handleUpdateField = useCallback(<K extends keyof UserStory>(field: K, value: UserStory[K]) => {
    if (!activeStory) return;
    const updated = { ...activeStory, [field]: value };
    updateStoryUseCase(repository, updated).then(res => {
      if (res.ok) loadStories(false); else setError(res.error.message);
    });
  }, [activeStory, repository, loadStories, setError]);

  // Delegar responsabilidades a sub-hooks (Strategy & SRP)
  const taskModule = useStoryTasks(activeStory, handleUpdateField, colStrategy);
  const criteriaModule = useStoryCriteria(activeStory, handleUpdateField, colStrategy);
  const riskModule = useStoryRisks(activeStory, handleUpdateField, colStrategy);

  return {
    stories, activeStory, activeId, isLoading,
    totalPoints: stories.reduce((a, s) => a + (s.effort || 0), 0),
    estimatedCount: stories.filter(s => s.effort !== null).length,
    progressPercentage: stories.length ? (stories.filter(s => s.effort).length / stories.length) * 100 : 0,
    
    getSuggestedEffort: (s: UserStory) => estimationStrategy.calculate(s),
    setActiveId,
    handleUpdateField,
    handleCreateNewStory: async () => {
      const res = await createUserStoryUseCase(repository, {
        role: "", action: "", benefit: "", status: StoryStatus.TODO, effort: null,
        description: "", criteria: [""], 
        tasks: [{ text: "", layer: StoryTechnicalLayer.BACKEND }],
        dependencies: [], 
        risks: [{ level: StoryRiskLevel.MEDIO, text: "" }],
      });
      if (res.ok) { await loadStories(false); setActiveId(res.value.id); }
      else setError(res.error.message);
    },
    handleDeleteStory: async (id: string) => {
      const res = await repository.delete(id);
      if (res.ok) { await loadStories(true); if (activeId === id) setActiveId(null); }
      else setError(res.error.message);
    },
    handleExportAll: () => exportStoriesUseCase(stories, 'historias').then(r => !r.ok && setError(r.error.message)),
    handleExportSingle: (id: string) => {
      const s = stories.find(x => x.id === id);
      if (s) exportStoriesUseCase([s], `story_${id}`).then(r => !r.ok && setError(r.error.message));
    },

    // Composición de módulos
    ...taskModule,
    ...criteriaModule,
    ...riskModule,

    // Dependencies (simples, se quedan aquí por ahora)
    handleAddDependency: (id: string) => !activeStory?.dependencies.includes(id) && handleUpdateField("dependencies", [...(activeStory?.dependencies || []), id]),
    handleRemoveDependency: (id: string) => handleUpdateField("dependencies", activeStory?.dependencies.filter(x => x !== id) || []),
    loadStories,
  };
};

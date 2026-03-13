export interface ICollectionStrategy {
  add: <T>(items: T[], newItem: T) => T[];
  remove: <T>(items: T[], idx: number, min: T[]) => T[];
  update: <T>(items: T[], idx: number, patch: Partial<T> | T) => T[];
  reorder: <T>(items: T[], start: number, end: number) => T[];
}

// Constantes para evitar magic strings
export const StoryCollection = {
  CRITERIA: "criteria",
  TASKS: "tasks",
  RISKS: "risks",
} as const;

export type StoryCollectionKey = typeof StoryCollection[keyof typeof StoryCollection];

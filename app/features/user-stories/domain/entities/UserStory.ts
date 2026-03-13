export const StoryStatus = {
  TODO: 'todo',
  PROGRESS: 'progress',
  DONE: 'done',
} as const;

export const StoryRiskLevel = {
  BAJO: 'bajo',
  MEDIO: 'medio',
  ALTO: 'alto',
} as const;

export const StoryTechnicalLayer = {
  BACKEND: 'backend',
  FRONTEND: 'frontend',
  BD: 'bd',
  INTEGRACION: 'integracion',
  INFRA: 'infra',
  OTRO: 'otro',
} as const;

export type UserStoryStatus = typeof StoryStatus[keyof typeof StoryStatus];
export type RiskLevel = typeof StoryRiskLevel[keyof typeof StoryRiskLevel];
export type TechnicalLayer = typeof StoryTechnicalLayer[keyof typeof StoryTechnicalLayer];

export interface TechnicalTask {
  text: string;
  layer: TechnicalLayer;
}

export interface Risk {
  level: RiskLevel;
  text: string;
}

export interface UserStory {
  id: string;
  role: string;
  action: string;
  benefit: string;
  status: UserStoryStatus;
  effort: number | null;
  description: string;
  criteria: string[];
  tasks: TechnicalTask[];
  dependencies: string[];
  risks: Risk[];
  createdAt: string;
}

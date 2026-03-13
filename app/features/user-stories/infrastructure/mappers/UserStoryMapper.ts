import { UserStory, UserStoryStatus, TechnicalLayer, RiskLevel } from "../../domain/entities/UserStory";

export interface UserStoryDTO {
  id: string;
  role: string;
  action: string;
  benefit: string;
  status: string;
  effort: number | null;
  description: string;
  criteria: string[];
  tasks: { text: string; layer: string }[];
  dependencies: string[];
  risks: { level: string; text: string }[];
  createdAt: string;
}

export const UserStoryMapper = {
  toDomain(dto: UserStoryDTO): UserStory {
    return {
      id: dto.id,
      role: dto.role,
      action: dto.action,
      benefit: dto.benefit,
      status: dto.status as UserStoryStatus,
      effort: dto.effort,
      description: dto.description,
      criteria: dto.criteria,
      tasks: dto.tasks.map(t => ({
        text: t.text,
        layer: t.layer as TechnicalLayer
      })),
      dependencies: dto.dependencies,
      risks: dto.risks.map(r => ({
        level: r.level as RiskLevel,
        text: r.text
      })),
      createdAt: dto.createdAt,
    };
  },

  toPersistence(story: UserStory): UserStoryDTO {
    return {
      ...story,
    };
  }
};

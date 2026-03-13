import { UserStory, StoryStatus } from "../../domain/entities/UserStory";
import { UI_TOKENS } from "../../../../shared/theme/ui-tokens";

interface StorySidebarProps {
  stories: UserStory[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  estimatedCount: number;
  progressPercentage: number;
  onNewStory: () => void;
}

const FIB_COLORS: Record<number, string> = {
  1: "#3dd9b3", 2: "#5b8dee", 3: "#7c6af5", 5: "#c56af5", 8: "#f05a6e", 13: "#f0a45a", 21: "#e879a0",
};

export const StorySidebar = ({ 
  stories, activeId, onSelect, onDelete,
  estimatedCount, progressPercentage, onNewStory
}: StorySidebarProps) => {
  return (
    <aside className={UI_TOKENS.sidebar}>
      <div className={UI_TOKENS.sidebarHeader}>
        <div className={UI_TOKENS.sectionTitle + " mb-3"}>
          Historias de usuario
        </div>
        <button 
          onClick={onNewStory}
          className={UI_TOKENS.buttonPrimary}
        >
          <span>+</span> Agregar historia
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-custom">
        {stories.length === 0 ? (
          <div className="text-center py-8 px-4 text-text-muted text-xs leading-relaxed">
            No hay historias aún.<br />Crea tu primera historia.
          </div>
        ) : (
          stories.map((story) => {
            const isActive = story.id === activeId;
            const effortColor = story.effort ? FIB_COLORS[story.effort] : 'var(--border2)';
            const statusColor = {
              [StoryStatus.TODO]: '#8a94b4',
              [StoryStatus.PROGRESS]: 'var(--accent)',
              [StoryStatus.DONE]: 'var(--accent3)'
            }[story.status];

            return (
              <div
                key={story.id}
                onClick={() => onSelect(story.id)}
                className={`${UI_TOKENS.card} ${isActive ? UI_TOKENS.cardActive : ""}`}
              >
                <button
                  onClick={(e) => onDelete(story.id, e)}
                  className="absolute top-2 right-2 p-1 text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 rounded-md transition-all text-sm"
                >
                  ✕
                </button>
                
                <div className="font-syne text-[13px] font-semibold mb-2 leading-tight pr-4">
                  {story.action || "Sin título"}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {story.effort && (
                    <span 
                      className={UI_TOKENS.badge}
                      style={{ 
                        color: effortColor, 
                        borderColor: `${effortColor}30`, 
                        background: `${effortColor}10` 
                      }}
                    >
                      {story.effort} pts
                    </span>
                  )}
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ background: statusColor }}
                  />
                  <span className="text-[11px] text-text-muted italic truncate max-w-[120px]">
                    {story.role || "Sin rol"}
                  </span>
                </div>

                <div className="text-[10px] text-text-muted font-dm-mono mt-2 tracking-wider">
                  {story.id}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-border bg-surface/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-text-secondary font-medium">
            {estimatedCount}/{stories.length} estimadas
          </span>
          <span className="text-[11px] text-accent3 font-bold">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className={UI_TOKENS.progressContainer}>
          <div 
            className={UI_TOKENS.progressBar}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-[9px] text-text-muted mt-2 uppercase tracking-widest font-bold">
          Progreso del Backlog
        </div>
      </div>
    </aside>
  );
};

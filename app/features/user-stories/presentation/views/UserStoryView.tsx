"use client";

import { useMemo } from "react";
import { useUserStoryViewModel } from "../view-models/useUserStoryViewModel";
import { StorySidebar } from "../components/StorySidebar";
import { StoryDetails } from "../components/StoryDetails";
import { makeUserStoryRepository } from "../../infrastructure/repositories/LocalStorageUserStoryRepository";
import { UI_TOKENS } from "../../../../shared/theme/ui-tokens";

export const UserStoryView = () => {
  const repository = useMemo(() => makeUserStoryRepository(), []);
  
  const { 
    stories, 
    activeStory, 
    activeId, 
    isLoading, 
    totalPoints, 
    progressPercentage,
    estimatedCount,
    setActiveId,
    handleCreateNewStory,
    handleDeleteStory,
    handleUpdateField,
    handleExportAll,
    handleExportSingle,
    // Criteria
    handleAddCriteria,
    handleUpdateCriteria,
    handleRemoveCriteria,
    // Tasks
    handleAddTask,
    handleUpdateTaskText,
    handleUpdateTaskLayer,
    handleRemoveTask,
    handleReorderTasks,
    // Risks
    handleAddRisk,
    handleUpdateRiskText,
    handleUpdateRiskLevel,
    handleRemoveRisk,
    // Dependencies
    handleAddDependency,
    handleRemoveDependency,
  } = useUserStoryViewModel(repository);

  if (isLoading && stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="text-4xl text-accent">⬡</div>
          <div className="text-xs font-dm-mono text-text-muted tracking-widest uppercase">Cargando Forja...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg text-text-primary overflow-hidden font-dm-sans">
      <header className={UI_TOKENS.header}>
        <div className="flex items-center gap-2 select-none">
          <span className="text-accent text-xl">⬡</span>
          <div className="font-syne font-extrabold text-lg tracking-tight text-text">
            Story<span className="text-accent">Forge</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="font-dm-mono text-xs font-medium text-text-muted uppercase tracking-wider">
            {totalPoints} <span className="text-[10px] opacity-70">pts totales</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateNewStory}
              className={UI_TOKENS.buttonSecondary}
            >
              + Nueva Historia
            </button>
            <button
              onClick={handleExportAll}
              className={UI_TOKENS.buttonGhost}
            >
              ⬇ Exportar .docx
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <StorySidebar 
          stories={stories} 
          activeId={activeId} 
          onSelect={setActiveId}
          onDelete={(id, e) => {
            e.stopPropagation();
            if (confirm('¿Eliminar esta historia?')) handleDeleteStory(id);
          }}
          estimatedCount={estimatedCount}
          progressPercentage={progressPercentage}
          onNewStory={handleCreateNewStory}
        />

        <main className={UI_TOKENS.main}>
          {activeStory ? (
            <StoryDetails 
              story={activeStory}
              otherStories={stories.filter(s => s.id !== activeStory.id)}
              onUpdateField={handleUpdateField}
              onExportSingle={() => handleExportSingle(activeStory.id)}
              // Criteria
              onAddCriteria={handleAddCriteria}
              onUpdateCriteria={handleUpdateCriteria}
              onRemoveCriteria={handleRemoveCriteria}
              // Tasks
              onAddTask={handleAddTask}
              onUpdateTaskText={handleUpdateTaskText}
              onUpdateTaskLayer={handleUpdateTaskLayer}
              onRemoveTask={handleRemoveTask}
              onReorderTasks={handleReorderTasks}
              // Risks
              onAddRisk={handleAddRisk}
              onUpdateRiskText={handleUpdateRiskText}
              onUpdateRiskLevel={handleUpdateRiskLevel}
              onRemoveRisk={handleRemoveRisk}
              // Dependencies
              onAddDependency={handleAddDependency}
              onRemoveDependency={handleRemoveDependency}
            />
          ) : (
            <div className={UI_TOKENS.emptyState}>
              <div className="text-7xl opacity-10 filter grayscale">⬡</div>
              <div className="space-y-2">
                <h2 className="font-syne font-bold text-2xl text-text-secondary tracking-tight">Sin historia seleccionada</h2>
                <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
                  Crea o selecciona una historia de usuario para empezar a estimar y definir requisitos.
                </p>
              </div>
              <button 
                onClick={handleCreateNewStory}
                className="mt-2 px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-all hover:scale-105 shadow-xl shadow-accent/20"
              >
                Crear primera historia
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

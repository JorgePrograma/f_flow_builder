import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { UserStory, TechnicalLayer, RiskLevel, StoryStatus, StoryRiskLevel, StoryTechnicalLayer } from "../../domain/entities/UserStory";
import { UI_TOKENS } from "../../../../shared/theme/ui-tokens";

// Atoms
import { StorySection } from "../../../../shared/components/ui/StorySection";
import { LabelInput, LabelTextArea } from "../../../../shared/components/ui/FormAtoms";

interface StoryDetailsProps {
  story: UserStory;
  otherStories: UserStory[];
  onUpdateField: <K extends keyof UserStory>(field: K, val: UserStory[K]) => void;
  onExportSingle: () => void;
  onAddCriteria: () => void;
  onUpdateCriteria: (idx: number, val: string) => void;
  onRemoveCriteria: (idx: number) => void;
  onAddTask: () => void;
  onUpdateTaskText: (idx: number, val: string) => void;
  onUpdateTaskLayer: (idx: number, layer: TechnicalLayer) => void;
  onRemoveTask: (idx: number) => void;
  onReorderTasks: (startIndex: number, endIndex: number) => void;
  onAddRisk: () => void;
  onUpdateRiskText: (idx: number, val: string) => void;
  onUpdateRiskLevel: (idx: number, level: RiskLevel) => void;
  onRemoveRisk: (idx: number) => void;
  onAddDependency: (depId: string) => void;
  onRemoveDependency: (depId: string) => void;
}

const FIB = [1, 2, 3, 5, 8, 13, 21];
const FIB_LABELS: Record<number, string> = {
  1: "Trivial", 2: "Pequeño", 3: "Mediano", 5: "Grande", 8: "Muy grande", 13: "Épico", 21: "Dividir HU",
};
const FIB_COLORS: Record<number, string> = {
  1: "#3dd9b3", 2: "#5b8dee", 3: "#7c6af5", 5: "#c56af5", 8: "#f05a6e", 13: "#f0a45a", 21: "#e879a0",
};

const LAYER_COLORS: Record<TechnicalLayer, { border: string; bg: string; text: string }> = {
  [StoryTechnicalLayer.BACKEND]: { border: '#5b8dee30', bg: '#5b8dee10', text: '#5b8dee' },
  [StoryTechnicalLayer.FRONTEND]: { border: '#3dd9b330', bg: '#3dd9b310', text: '#3dd9b3' },
  [StoryTechnicalLayer.BD]: { border: '#f0a45a30', bg: '#f0a45a10', text: '#f0a45a' },
  [StoryTechnicalLayer.INTEGRACION]: { border: '#7c6af530', bg: '#7c6af510', text: '#7c6af5' },
  [StoryTechnicalLayer.INFRA]: { border: '#f05a6e30', bg: '#f05a6e10', text: '#f05a6e' },
  [StoryTechnicalLayer.OTRO]: { border: '#8a94b430', bg: '#8a94b410', text: '#8a94b4' },
};

const LAYERS: { value: TechnicalLayer; label: string }[] = [
  { value: StoryTechnicalLayer.BACKEND, label: 'Backend' },
  { value: StoryTechnicalLayer.FRONTEND, label: 'Frontend' },
  { value: StoryTechnicalLayer.BD, label: 'BD' },
  { value: StoryTechnicalLayer.INTEGRACION, label: 'Integración' },
  { value: StoryTechnicalLayer.INFRA, label: 'Infra' },
  { value: StoryTechnicalLayer.OTRO, label: 'Otro' },
];

export const StoryDetails = ({ 
  story, otherStories, onUpdateField, onExportSingle,
  onAddCriteria, onUpdateCriteria, onRemoveCriteria,
  onAddTask, onUpdateTaskText, onUpdateTaskLayer, onRemoveTask, onReorderTasks,
  onAddRisk, onUpdateRiskText, onUpdateRiskLevel, onRemoveRisk,
  onAddDependency, onRemoveDependency
}: StoryDetailsProps) => {
  const [droppedId, setDroppedId] = useState<string | null>(null);
  const effortColor = story.effort ? FIB_COLORS[story.effort] : "var(--text3)";

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderTasks(result.source.index, result.destination.index);
    setDroppedId(result.draggableId);
    setTimeout(() => setDroppedId(null), 650);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. DEFINICIÓN */}
      <StorySection 
        icon="📋" 
        title="Definición de la Historia"
        className="shadow-xl shadow-black/20"
        headerAction={
          <select 
            value={story.status || StoryStatus.TODO}
            onChange={(e) => onUpdateField('status', e.target.value as UserStory['status'])}
            className={UI_TOKENS.select}
          >
            <option value={StoryStatus.TODO}>Por hacer</option>
            <option value={StoryStatus.PROGRESS}>En progreso</option>
            <option value={StoryStatus.DONE}>Completada</option>
          </select>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
          <div className="space-y-5">
            <div className="text-[10px] text-text-muted font-dm-mono mb-2 tracking-widest">
              {story.id} · Creada {new Date(story.createdAt).toLocaleDateString('es-CO')}
            </div>
            
            <div className="grid gap-4">
              <LabelInput label="Yo como..." value={story.role} onChange={(e) => onUpdateField('role', e.target.value)} placeholder="ej. Ingeniero de Sistemas, Cliente..." />
              <LabelInput label="Quiero..." value={story.action} onChange={(e) => onUpdateField('action', e.target.value)} placeholder="ej. Crear un reporte mensual de ventas..." />
              <LabelInput label="Para..." value={story.benefit} onChange={(e) => onUpdateField('benefit', e.target.value)} placeholder="ej. Identificar áreas de mejora en el negocio..." />
            </div>
            
            <LabelTextArea label="Descripción adicional" value={story.description} onChange={(e) => onUpdateField('description', e.target.value)} placeholder="Contexto, notas, requisitos de negocio..." />
          </div>

          {/* FIBONACCI SELECTOR */}
          <div className="flex flex-col items-center gap-6 p-8 bg-surface2/30 border border-border/50 min-w-[260px] h-fit rounded-4xl">
            <span className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase font-syne">Esfuerzo (SP)</span>
            <div className="grid grid-cols-4 gap-2.5">
              {FIB.map(points => (
                <button
                  key={points}
                  onClick={() => onUpdateField('effort', story.effort === points ? null : points as UserStory['effort'])}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl font-dm-mono text-sm border-2 transition-all hover:scale-110 active:scale-95 ${
                    story.effort === points ? "shadow-lg scale-105" : "border-border/30 text-text3 hover:border-border2"
                  }`}
                  style={story.effort === points ? { backgroundColor: FIB_COLORS[points], borderColor: FIB_COLORS[points], color: 'white' } : {}}
                >
                  {points}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <div className="font-syne font-black text-6xl tracking-tighter transition-colors duration-300" style={{ color: effortColor }}>
                {story.effort || "—"}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: effortColor }}>
                {story.effort ? FIB_LABELS[story.effort] : "Sin estimar"}
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* 2. CRITERIOS DE ACEPTACIÓN */}
      <StorySection 
        icon="✅" 
        title="Criterios de Aceptación"
        headerAction={<span className="text-[10px] text-text-muted font-bold px-2 py-1 bg-surface3 rounded-md">{story.criteria.filter(c => c).length} DEFINIDOS</span>}
      >
        <div className="space-y-3">
          {story.criteria.map((c, idx) => (
            <div key={idx} className="flex gap-4 group items-start bg-surface2/50 border border-border/50 rounded-xl p-2 transition-all hover:border-border2">
              <span className="font-dm-mono text-[10px] text-text-muted mt-2.5 ml-2 font-bold">{idx + 1}.</span>
              <textarea value={c} onChange={(e) => onUpdateCriteria(idx, e.target.value)} placeholder="¿Qué debe cumplir esta historia?" rows={1} className={UI_TOKENS.inputGhost} />
              <button onClick={() => onRemoveCriteria(idx)} className={UI_TOKENS.buttonIcon}>✕</button>
            </div>
          ))}
          <button onClick={onAddCriteria} className={UI_TOKENS.buttonAdd}>+ Agregar Criterio</button>
        </div>
      </StorySection>

      {/* 3. TAREAS TÉCNICAS */}
      <StorySection 
        icon="⚙️" 
        title="Tareas Técnicas"
        headerAction={<span className="text-[10px] text-text-muted font-bold px-2 py-1 bg-surface3 rounded-md">{story.tasks.length} TAREAS</span>}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {story.tasks.map((task, idx) => {
                  const colors = LAYER_COLORS[task.layer];
                  const isDropped = droppedId === `${story.id}-task-${idx}`;
                  return (
                    <Draggable key={`${story.id}-task-${idx}`} draggableId={`${story.id}-task-${idx}`} index={idx}>
                      {(p, snapshot) => (
                        <div
                          ref={p.innerRef} {...p.draggableProps}
                          className={`flex gap-3 group items-center border rounded-xl p-1.5 pr-3 transition-all ${
                            snapshot.isDragging ? "shadow-2xl z-50 scale-[1.02] border-accent" : "hover:border-border2"
                          } ${isDropped ? "animate-drop-shock" : ""}`}
                          style={{ ...p.draggableProps.style, backgroundColor: colors.bg, borderColor: snapshot.isDragging ? 'var(--accent)' : colors.border }}
                        >
                          <div {...p.dragHandleProps} className="p-2 cursor-grab active:cursor-grabbing text-text3/30 hover:text-accent transition-colors">
                            <span className="text-lg">⣿</span>
                          </div>
                          <span className="font-dm-mono text-[10px] text-text3/50 font-bold min-w-[20px] text-center">{String(idx + 1).padStart(2, '0')}</span>
                          <textarea value={task.text} onChange={(e) => onUpdateTaskText(idx, e.target.value)} placeholder="Describe la tarea técnica..." rows={1} className={UI_TOKENS.inputGhost} style={{ color: 'var(--text-primary)' }} />
                          <select value={task.layer} onChange={(e) => onUpdateTaskLayer(idx, e.target.value as TechnicalLayer)} className={UI_TOKENS.select} style={{ color: colors.text }}>
                            {LAYERS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                          </select>
                          <button onClick={() => onRemoveTask(idx)} className={UI_TOKENS.buttonIcon}>✕</button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button onClick={onAddTask} className={UI_TOKENS.buttonAdd}>+ Agregar Tarea</button>
      </StorySection>

      {/* 4. DEPENDENCIAS */}
      <StorySection icon="🔗" title="Dependencias">
        <div className="flex flex-wrap gap-2 mb-4">
          {story.dependencies.length === 0 ? (
            <p className="text-xs text-text3 italic">Sin dependencias registradas.</p>
          ) : (
            story.dependencies.map(depId => {
              const dep = otherStories.find(s => s.id === depId);
              return (
                <div key={depId} className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg">
                  <span className="text-[10px] font-dm-mono font-bold text-accent">{depId}</span>
                  <span className="text-[11px] text-text-primary truncate max-w-[150px]">{dep?.action || '—'}</span>
                  <button onClick={() => onRemoveDependency(depId)} className="text-accent hover:text-danger transition-all ml-1">✕</button>
                </div>
              );
            })
          )}
        </div>
        <select defaultValue="" onChange={(e) => { if (e.target.value) { onAddDependency(e.target.value); e.target.value = ""; } }} className={UI_TOKENS.select + " w-full h-11"}>
          <option value="" disabled>Seleccionar historia para vincular...</option>
          {otherStories.filter(s => !story.dependencies.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.id} - {s.action}</option>)}
        </select>
      </StorySection>

      {/* 5. RIESGOS */}
      <StorySection icon="⚠️" title="Riesgos y Bloqueos">
        <div className="space-y-3">
          {story.risks.map((risk, idx) => {
            const levelColor = { [StoryRiskLevel.BAJO]: 'var(--accent3)', [StoryRiskLevel.MEDIO]: 'var(--warn)', [StoryRiskLevel.ALTO]: 'var(--danger)' }[risk.level];
            return (
              <div key={idx} className="flex gap-4 group items-center bg-surface2/50 border border-border/50 rounded-xl p-1.5 pr-3 transition-all hover:border-border2">
                <select value={risk.level} onChange={(e) => onUpdateRiskLevel(idx, e.target.value as RiskLevel)} className={UI_TOKENS.select + " w-[100px] text-center"} style={{ color: levelColor, borderColor: `${levelColor}40` }}>
                  <option value={StoryRiskLevel.BAJO}>Bajo</option>
                  <option value={StoryRiskLevel.MEDIO}>Medio</option>
                  <option value={StoryRiskLevel.ALTO}>Alto</option>
                </select>
                <textarea value={risk.text} onChange={(e) => onUpdateRiskText(idx, e.target.value)} placeholder="Describe el riesgo o bloqueo..." rows={1} className={UI_TOKENS.inputGhost} />
                <button onClick={() => onRemoveRisk(idx)} className={UI_TOKENS.buttonIcon}>✕</button>
              </div>
            );
          })}
          <button onClick={onAddRisk} className={UI_TOKENS.buttonAdd}>+ Agregar Riesgo</button>
        </div>
      </StorySection>

      {/* EXPORT ACTION */}
      <section className="bg-surface2/50 border border-border2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
        <div className="text-3xl">📄</div>
        <div className="space-y-1">
          <h4 className="font-syne font-bold text-sm text-text-primary">Exportar esta historia</h4>
          <p className="text-xs text-text-muted">Genera un documento Word individual para esta historia de usuario.</p>
        </div>
        <button onClick={onExportSingle} className="px-6 py-2 bg-accent3 text-bg font-bold rounded-lg text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
          Exportar historia actual
        </button>
      </section>
    </div>
  );
};

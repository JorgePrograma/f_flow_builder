/**
 * Design Tokens para mantener la consistencia visual en todo el proyecto.
 * Evita la duplicación de clases de Tailwind y facilita cambios globales.
 */

export const UI_TOKENS = {
  // Contenedores principales (Secciones)
  container: "bg-surface border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/10 transition-all",
  containerHeader: "px-5 py-4 border-b border-border flex items-center justify-between bg-surface/50",
  containerBody: "p-6 space-y-4",

  // Tipografía
  sectionTitle: "font-syne text-[11px] font-bold tracking-widest uppercase text-text-muted",
  label: "text-[11px] font-bold text-text-secondary uppercase tracking-wider ml-1",
  
  // Entradas de datos
  input: "w-full bg-surface2 border border-border2 rounded-xl p-3 text-sm text-text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-muted/20",
  inputGhost: "w-full bg-transparent p-2 text-[13px] text-text-primary outline-none resize-none placeholder:text-text3/50",
  
  // Botones de acción (Add/Remove)
  buttonAdd: "w-full py-3 border-2 border-dashed border-border rounded-xl text-[11px] font-bold text-text-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all uppercase tracking-[0.2em]",
  buttonIcon: "p-2 text-text3/50 hover:text-danger hover:bg-danger/10 rounded-lg transition-all",

  // Selectores y Botones
  select: "bg-surface3/50 text-text-secondary border border-border2 rounded-lg px-3 py-1.5 text-xs font-medium outline-none hover:border-accent transition-all cursor-pointer",
  buttonPrimary: "w-full bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95 flex items-center justify-center gap-2",
  
  // Sidebar & Lista
  sidebar: "w-[300px] bg-surface border-r border-border flex flex-col shrink-0",
  sidebarHeader: "p-5 border-b border-border",
  card: "group relative bg-surface2 border border-border rounded-xl p-4 mb-2 cursor-pointer transition-all hover:border-border2 hover:translate-x-0.5",
  cardActive: "border-accent bg-accent/5",
  badge: "font-dm-mono text-[10px] font-medium px-1.5 py-0.5 rounded border",
  
  // Progress Bar
  progressContainer: "h-1.5 w-full bg-surface3 rounded-full overflow-hidden",
  progressBar: "h-full bg-accent3 transition-all duration-500 rounded-full",

  // Layout & Header
  header: "h-[60px] flex items-center justify-between px-8 bg-surface border-b border-border z-50",
  main: "flex-1 overflow-y-auto bg-bg p-8 scrollbar-custom scroll-smooth",
  
  // Botones Adicionales
  buttonSecondary: "px-4 py-1.5 bg-surface2 border border-border2 hover:border-accent hover:text-accent text-text-secondary rounded-lg text-xs font-medium transition-all active:scale-95",
  buttonGhost: "px-4 py-1.5 bg-accent3 text-bg hover:bg-accent3/90 text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-accent3/10",

  // Empty State
  emptyState: "h-full flex flex-col items-center justify-center text-center gap-6 py-20 select-none animate-in fade-in zoom-in-95 duration-700",
} as const;

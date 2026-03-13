# Patrón ViewModel + Zustand

## Flujo obligatorio

```
Use Case → ViewModel Hook → Zustand Store → Componente
```

| Pieza                 | Responsabilidad                                        |
| --------------------- | ------------------------------------------------------ |
| **Use Case**          | Orquesta lógica de negocio, llama al repository        |
| **ViewModel Hook**    | Adapta datos del use-case al estado que necesita la UI |
| **Zustand Store**     | Estado UI reactivo compartido entre componentes        |
| **Componente / View** | Solo renderiza. Cero lógica propia                     |

---

## Zustand Store

```ts
// features/sessions/presentation/store/sessionStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Session } from "../../domain/entities/Session";

interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  setSessions: (sessions: Session[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = { sessions: [], isLoading: false, error: null };

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      ...initialState,
      setSessions: (sessions) =>
        set({ sessions }, false, "session/setSessions"),
      setLoading: (isLoading) =>
        set({ isLoading }, false, "session/setLoading"),
      setError: (error) => set({ error }, false, "session/setError"),
      reset: () => set(initialState, false, "session/reset"),
    }),
    { name: "SessionStore" },
  ),
);
```

**Reglas:**

- ✅ `devtools` siempre, con nombre de acción `slice/accion`.
- ✅ `initialState` separado para poder usar en `reset()`.
- ❌ Sin fetch ni lógica de negocio dentro del store.
- ❌ Sin stores monolíticos globales — uno por feature o dominio acotado.

---

## ViewModel Hook

```ts
// features/sessions/presentation/view-models/useSessionListViewModel.ts
import { useCallback, useEffect } from "react";
import { getSessionsUseCase } from "../../application/use-cases/getSessionsUseCase";
import { makeHttpSessionRepository } from "../../infrastructure/repositories/HttpSessionRepository";
import { useSessionStore } from "../store/sessionStore";

export const useSessionListViewModel = () => {
  // Selección granular — evita re-renders innecesarios
  const sessions = useSessionStore((s) => s.sessions);
  const isLoading = useSessionStore((s) => s.isLoading);
  const error = useSessionStore((s) => s.error);
  const setSessions = useSessionStore((s) => s.setSessions);
  const setLoading = useSessionStore((s) => s.setLoading);
  const setError = useSessionStore((s) => s.setError);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionsUseCase({
        repository: makeHttpSessionRepository(),
      });
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Estado derivado — se calcula aquí, nunca en el componente
  const activeSessions = sessions.filter((s) => s.status === "active");
  const hasError = error !== null;
  const isEmpty = !isLoading && sessions.length === 0;

  return {
    sessions,
    activeSessions,
    isLoading,
    hasError,
    isEmpty,
    error,
    loadSessions,
  };
};
```

**Reglas:**

- ✅ Seleccionar propiedades **individuales** del store (`s => s.sessions`), nunca el objeto completo.
- ✅ Estado derivado (`isEmpty`, `hasError`, `activeSessions`) se calcula aquí.
- ✅ Exponer acciones semánticas, no setters crudos del store.
- ❌ Sin lógica de negocio — solo orquestación de UI y estado derivado.

---

## Componente / View

```tsx
// features/sessions/presentation/views/SessionListView.tsx
"use client";
import { useSessionListViewModel } from "../view-models/useSessionListViewModel";
import { SessionCard } from "../components/SessionCard";

const SessionListView = () => {
  const { sessions, isLoading, hasError, isEmpty, error, loadSessions } =
    useSessionListViewModel();

  if (isLoading) return <SessionListSkeleton />;
  if (hasError) return <ErrorBanner message={error} onRetry={loadSessions} />;
  if (isEmpty) return <EmptyState message="No hay sesiones activas" />;

  return (
    <ul>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </ul>
  );
};

export default SessionListView;
```

**Reglas:**

- ✅ Solo renderiza — consume el ViewModel, nada más.
- ❌ Sin `useState`, `useEffect` ni lógica de fetching en la View.
- ❌ Sin cálculos de estado derivado — eso va en el ViewModel.

# Estilos de Código

## TypeScript

- `"strict": true` en `tsconfig.json` — obligatorio.
- ❌ Sin `any`. Usar `unknown` con narrowing explícito.
- ❌ Sin `// @ts-ignore`. Resolver el error correctamente.
- ✅ Tipar el retorno de funciones públicas y use-cases.
- ✅ Exportar desde `index.ts` en cada carpeta para imports limpios.

---

## React / Next.js

- ❌ Sin `useEffect` para fetching — usar ViewModel + Zustand.
- ❌ Sin lógica de negocio en componentes — va en el ViewModel.
- ✅ Un componente = una responsabilidad.
- ✅ **Atomic Components**: Usar átomos reutilizables en `shared/components/ui/` para layouts comunes.

---

## Tailwind & CSS

- ❌ **Prohibido duplicar clases**: Si un conjunto de clases se usa en más de un lugar, debe ir a `UI_TOKENS`.
- ✅ **Design Tokens**: Usar `shared/theme/ui-tokens.ts` para centralizar variantes de Tailwind.
- ✅ **CSS Variables**: Usar variables CSS en `globals.css` para colores de marca y tema.

```tsx
// ✅ Correcto — lógica delegada al ViewModel
const SessionList = () => {
  const { sessions, isLoading } = useSessionListViewModel();
  return (
    <ul>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} />
      ))}
    </ul>
  );
};

// ❌ Incorrecto — fetch directo en el componente
const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then(setSessions);
  }, []);
  return <ul>...</ul>;
};
```

---

## Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

---

## ESLint — reglas clave

| Regla                                              | Nivel |
| -------------------------------------------------- | ----- |
| `no-unused-vars`                                   | error |
| `no-console`                                       | warn  |
| `@typescript-eslint/no-explicit-any`               | error |
| `@typescript-eslint/explicit-function-return-type` | warn  |
| `react-hooks/rules-of-hooks`                       | error |
| `react-hooks/exhaustive-deps`                      | warn  |
| `import/order`                                     | error |

---

## Orden de imports

```ts
// 1. Node built-ins
import path from "path";

// 2. Externos (npm)
import { create } from "zustand";
import { z } from "zod";

// 3. Internos absolutos (@/)
import { Button } from "@/shared/components/ui/Button";
import type { Session } from "@/features/sessions/domain/entities/Session";

// 4. Relativos
import { SessionCard } from "../components/SessionCard";
import type { SessionListViewProps } from "./SessionListView.types";
```

# Convenciones de Nombres

## Archivos y carpetas

| Tipo                 | Convención                         | Ejemplo                        |
| -------------------- | ---------------------------------- | ------------------------------ |
| Carpetas             | `kebab-case`                       | `parking-sessions/`            |
| Componentes React    | `PascalCase.tsx`                   | `SessionCard.tsx`              |
| Views                | `PascalCase` + `View`              | `SessionListView.tsx`          |
| ViewModel Hooks      | `use` + `PascalCase` + `ViewModel` | `useSessionListViewModel.ts`   |
| Hooks genéricos      | `use` + `PascalCase`               | `useDebounce.ts`               |
| Stores Zustand       | `use` + `PascalCase` + `Store`     | `useSessionStore.ts`           |
| Use Cases            | `camelCase` + `UseCase`            | `getSessionsUseCase.ts`        |
| Entidades            | `PascalCase`                       | `Session.ts`                   |
| Interfaces           | `I` + `PascalCase`                 | `ISessionRepository.ts`        |
| Repositorios (impl.) | `PascalCase` + `Repository`        | `HttpSessionRepository.ts`     |
| Mappers              | `PascalCase` + `Mapper`            | `SessionMapper.ts`             |
| Value Objects        | `PascalCase`                       | `VehiclePlate.ts`              |
| Domain Errors        | `PascalCase` + `Error`             | `SessionAlreadyClosedError.ts` |
| Schemas Zod          | `camelCase` + `Schema`             | `createSessionSchema.ts`       |
| Factories            | `make` + `PascalCase`              | `makeHttpSessionRepository`    |
| DTOs                 | `PascalCase` + `DTO`               | `SessionDTO`                   |
| Props de componentes | `PascalCase` + `Props`             | `SessionCardProps`             |
| Constantes           | `SCREAMING_SNAKE_CASE`             | `API_BASE_URL`                 |

---

## Variables y funciones

| Caso               | Prefijo / sufijo   | Ejemplo                             |
| ------------------ | ------------------ | ----------------------------------- |
| Booleanos          | `is`, `has`, `can` | `isLoading`, `hasError`, `canClose` |
| Event handlers     | `handle`           | `handleSubmit`, `handleClose`       |
| Factories          | `make`             | `makeHttpSessionRepository`         |
| Callbacks de props | `on`               | `onDelete`, `onSuccess`             |

---

## Tipos TypeScript

- `interface` para contratos de objetos y props de componentes.
- `type` para unions, intersections y aliases.
- Interfaces de contratos con prefijo `I` → `ISessionRepository`.
- Tipos de respuesta API con sufijo `DTO` → `SessionDTO`.

```ts
// ✅ Correcto
interface Session { id: string; status: 'active' | 'closed' }
interface ISessionRepository { findAll(): Promise<Session[]> }
type SessionStatus = 'active' | 'closed'
interface SessionCardProps { session: Session; onDelete: (id: string) => void }

// ❌ Incorrecto
const session: any = { ... }
const card = ({ s, del }: any) => { ... }
```

## Reglas Críticas Adicionales

- **No Magic Strings**: Prohibido usar strings literales para claves de objetos, estados o tipos de colecciones. Usar objetos constantes con `as const`.
- **Sincronización de Tipos**: Vincular siempre los tipos de acceso indexado (`Entity[typeof CONST]`) a la constante que define la clave.

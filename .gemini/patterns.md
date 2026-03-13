# Patrones de Diseño por Capa

Aplicar donde haya una necesidad real. **No sobre-ingeniería.**

---

## Domain

### Value Object — tipo con validación y sin identidad propia

```ts
// domain/value-objects/VehiclePlate.ts
export class VehiclePlate {
  private readonly value: string;
  constructor(plate: string) {
    if (!/^[A-Z]{3}\d{3}$/.test(plate))
      throw new Error(`Placa inválida: ${plate}`);
    this.value = plate.toUpperCase();
  }
  toString() {
    return this.value;
  }
  equals(other: VehiclePlate) {
    return this.value === other.value;
  }
}
```

### Domain Error — errores de negocio tipados

```ts
// domain/errors/SessionAlreadyClosedError.ts
export class SessionAlreadyClosedError extends Error {
  constructor(sessionId: string) {
    super(`La sesión ${sessionId} ya fue cerrada`);
    this.name = "SessionAlreadyClosedError";
  }
}
```

### Repository Interface — contrato de acceso a datos

```ts
// domain/repositories/ISessionRepository.ts
import type { Session } from "../entities/Session";
export interface ISessionRepository {
  findAll(): Promise<Session[]>;
  findById(id: string): Promise<Session | null>;
  close(id: string, exitTime: Date): Promise<Session>;
}
```

---

## Application

### Use Case — una acción de negocio, un archivo

```ts
// application/use-cases/closeSessionUseCase.ts
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { SessionAlreadyClosedError } from "../../domain/errors/SessionAlreadyClosedError";

interface Deps {
  repository: ISessionRepository;
}
interface Input {
  sessionId: string;
  exitTime: Date;
}

export const closeSessionUseCase = async (
  { repository }: Deps,
  { sessionId, exitTime }: Input,
) => {
  const session = await repository.findById(sessionId);
  if (!session) throw new Error(`Sesión ${sessionId} no encontrada`);
  if (session.status === "closed")
    throw new SessionAlreadyClosedError(sessionId);
  return repository.close(sessionId, exitTime);
};
```

### Port — interfaz de servicio externo que el dominio necesita

```ts
// application/ports/INotificationService.ts
export interface INotificationService {
  sendSessionClosed(sessionId: string, plate: string): Promise<void>;
}
```

---

## Infrastructure

### Mapper — transforma DTO ↔ Entity, sin lógica de negocio

```ts
// infrastructure/mappers/SessionMapper.ts
import type { Session } from "../../domain/entities/Session";

interface SessionDTO {
  session_id: string;
  vehicle_plate: string;
  entry_time: string;
  exit_time: string | null;
  status: string;
  total_amount: number | null;
}

export const SessionMapper = {
  toDomain(dto: SessionDTO): Session {
    return {
      id: dto.session_id,
      vehiclePlate: dto.vehicle_plate,
      entryTime: new Date(dto.entry_time),
      exitTime: dto.exit_time ? new Date(dto.exit_time) : null,
      status: dto.status as Session["status"],
      totalAmount: dto.total_amount,
    };
  },
};
```

### Factory — crea instancias con dependencias inyectadas

```ts
// infrastructure/repositories/HttpSessionRepository.ts
export class HttpSessionRepository implements ISessionRepository {
  async findAll() {
    const { data } = await apiClient.get("/sessions");
    return data.map(SessionMapper.toDomain);
  }
  // ...
}

// Factory para inyección de dependencias limpia
export const makeHttpSessionRepository = (): ISessionRepository =>
  new HttpSessionRepository();
```

---

## Presentation

### Compound Component — partes fuertemente relacionadas

```tsx
// shared/components/ui/Table/index.tsx
const Table = ({ children }: { children: React.ReactNode }) => <table>{children}</table>
Table.Head = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>
Table.Row  = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>
Table.Cell = ({ children }: { children: React.ReactNode }) => <td>{children}</td>

// Uso:
<Table>
  <Table.Head>...</Table.Head>
  <Table.Row><Table.Cell>Dato</Table.Cell></Table.Row>
</Table>
```

### Type-Safe Literals (Magic Strings Prevention)

Vincular constantes en tiempo de ejecución con el sistema de tipos para evitar errores de referencia.

```ts
// types.ts
export const Collection = {
  USERS: "users",
  GROUPS: "groups",
} as const;

// El tipo se deriva de la constante
export type CollectionKey = (typeof Collection)[keyof typeof Collection];

// El acceso a tipos de entidad se indexa por la constante
export type UserData = Entity[typeof Collection.USERS];
```

### Atomic Design + UI Tokens

Patrón para centralizar identidades visuales y estructuras de UI sin duplicar clases de Tailwind.

```ts
// shared/theme/ui-tokens.ts
export const UI_TOKENS = {
  container: "bg-surface border border-border rounded-xl",
  input: "w-full p-3 bg-surface2 border rounded-lg focus:border-accent"
} as const;

// shared/components/ui/MyAtom.tsx
export const MyAtom = ({ children }) => (
  <div className={UI_TOKENS.container}>{children}</div>
);
```

---

## Resumen por capa

| Capa               | Patrones aplicables                                                              |
| ------------------ | -------------------------------------------------------------------------------- |
| **Domain**         | Value Object, Entity, Repository Interface, Domain Error                         |
| **Application**    | Use Case, Port, CQRS light (Query / Command)                                     |
| **Infrastructure** | Repository (impl.), Mapper, Factory, Adapter                                     |
| **Presentation**   | ViewModel Hook, Observer (Zustand), Compound Component, Container/Presentational |

**Reglas:**

- ✅ El patrón más simple que resuelva el problema.
- ✅ Composición sobre herencia en todo el codebase.
- ❌ Sin herencia de clases en domain/application.
- ❌ Sin patrones aplicados "por completitud" sin necesidad real.

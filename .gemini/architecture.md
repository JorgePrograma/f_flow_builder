# Arquitectura — Clean Architecture

## Capas y dirección de dependencias

```
┌──────────────────────────────────────┐
│           PRESENTATION               │  UI, ViewModels, Zustand stores
├──────────────────────────────────────┤
│           APPLICATION                │  Use Cases, orquestación
├──────────────────────────────────────┤
│             DOMAIN                   │  Entidades, interfaces, value objects
├──────────────────────────────────────┤
│          INFRASTRUCTURE              │  HTTP, mappers, implementaciones
└──────────────────────────────────────┘
```

| Capa              | Puede importar de                                 | Nunca importa de                                  |
| ----------------- | ------------------------------------------------- | ------------------------------------------------- |
| `domain/`         | Solo de sí misma                                  | todo lo demás                                     |
| `application/`    | `domain/`                                         | `infrastructure/`, `presentation/`, frameworks UI |
| `infrastructure/` | `domain/`, librerías externas                     | `application/`, `presentation/`                   |
| `presentation/`   | `application/`, `domain/` (solo tipos), `shared/` | `infrastructure/` directamente                    |

---

## Estructura de carpetas

```
app/
├── layout.tsx                    # Layout raíz de Next.js
├── page.tsx                      # Punto de entrada / Home de la aplicación
├── globals.css                   # Estilos globales
│
├── features/[feature-name]/      # Modularización por dominio
│   ├── domain/
│   │   ├── entities/             # Modelos de negocio puros (interfaces/tipos)
│   │   ├── repositories/         # Interfaces/contratos de acceso a datos
│   │   ├── value-objects/        # Objetos inmutables con validación propia
│   │   └── errors/               # Errores de dominio tipados
│   │
│   ├── application/
│   │   ├── use-cases/            # Un archivo por caso de uso
│   │   └── ports/                # Interfaces de servicios externos (opcional)
│   │
│   ├── infrastructure/
│   │   ├── repositories/         # Implementaciones HTTP/Data concretas
│   │   ├── mappers/              # DTO ↔ Entity
│   │   └── services/             # Implementaciones de ports
│   │
│   └── presentation/
│       ├── components/           # Componentes React de la feature
│       ├── view-models/          # Hooks ViewModel (Lógica de UI)
│       ├── store/                # Zustand stores de la feature
│       └── schemas/              # Validaciones Zod para formularios/UI
│
├── shared/                       # Código compartido entre features
│   ├── components/ui/            # UI genérica (shadcn/ui o similar)
│   ├── hooks/                    # Hooks utilitarios globales
│   ├── lib/                      # Instancias singleton (cliente API, etc.)
│   ├── store/                    # Stores Zustand globales (auth, app-state)
│   ├── types/                    # Tipos globales
│   └── utils/                    # Funciones puras utilitarias
│
├── config/                       # Variables de entorno y constantes
└── styles/                       # Tokens de diseño adicionales (opcional)
```

---

## Restricciones

- ❌ Lógica en `App.tsx` o routing.
- ❌ `fetch` en componentes, views o use-cases — solo en `infrastructure/repositories/`.
- ❌ Importar entre features directamente — usar `shared/` como puente.
- ❌ Acceder a Zustand desde un use-case o domain.
- ✅ Cada feature autocontenida — eliminarla no rompe otras features.
- ✅ Componentes con más de 2 archivos tienen su propia subcarpeta con `index.ts`.

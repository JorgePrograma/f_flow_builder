# GEMINI.md

> Reglas obligatorias del proyecto. No se aceptan excepciones sin justificación explícita.
> Documentación detallada en `.gemini/`

---

## Stack

- **Framework**: React + Next.js (App Router)
- **Lenguaje**: TypeScript strict
- **Estado UI**: Zustand con devtools
- **Validación**: Zod
- **Estilos**: Tailwind CSS

---

## Arquitectura

Clean Architecture en 4 capas. Las dependencias apuntan siempre hacia `domain/`.

```
presentation/ → application/ → domain/ ← infrastructure/
```

Detalle completo → `.gemini/architecture.md`

---

## Reglas críticas (siempre aplican)

1. **Capa correcta** — nunca mezclar responsabilidades entre capas.
2. **ViewModel obligatorio** — todo estado de UI pasa por un hook ViewModel en `presentation/view-models/`.
3. **Zustand** — un store por feature, `devtools` siempre, selección granular, sin lógica de negocio.
4. **Sin `any`** — TypeScript strict en todo el codebase.
5. **Sin fetch en componentes** — solo en `infrastructure/repositories/`.
6. **Mapper siempre** — transformar DTO ↔ Entity solo en `infrastructure/mappers/`.
7. **Factory para repositorios** — instanciar con funciones `make*`.
8. **Conventional Commits** — en todo mensaje de commit sugerido.
9. **No instalar dependencias** sin mencionarlo y justificarlo.
10. **Preguntar antes de refactorizar** capas o estructura de carpetas.

---

## Índice de documentación

| Archivo                        | Contenido                                                     |
| ------------------------------ | ------------------------------------------------------------- |
| `.gemini/architecture.md`      | Capas, estructura de carpetas, reglas de dependencia          |
| `.gemini/zustand-viewmodel.md` | Patrón ViewModel + Zustand con ejemplos de código             |
| `.gemini/patterns.md`          | Patrones de diseño por capa (Value Object, Mapper, Factory…)  |
| `.gemini/naming.md`            | Convenciones de nombres para archivos, variables y tipos      |
| `.gemini/code-style.md`        | TypeScript, React/Next.js, Prettier, ESLint, orden de imports |
| `.gemini/git.md`               | Conventional Commits, tipos, scopes, branches, PRs            |

---

_Actualizar este archivo con cada cambio arquitectónico significativo._

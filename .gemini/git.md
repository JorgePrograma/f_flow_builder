# Git & Conventional Commits

## Formato de commit

```
<type>(<scope>): <description>

[body opcional — qué y por qué, no cómo]

[footer — refs: INS-142 | BREAKING CHANGE: ...]
```

---

## Tipos

| Tipo       | Uso                           |
| ---------- | ----------------------------- |
| `feat`     | Nueva funcionalidad           |
| `fix`      | Corrección de bug             |
| `refactor` | Cambio sin impacto funcional  |
| `style`    | Formato/espaciado (no lógica) |
| `docs`     | Documentación                 |
| `test`     | Tests                         |
| `chore`    | Build, deps, config           |
| `perf`     | Mejora de rendimiento         |
| `ci`       | CI/CD                         |

---

## Scopes del proyecto

`auth` · `sessions` · `parking` · `users` · `payments` · `reports` · `shared` · `infra` · `config`

---

## Ejemplos

```
feat(sessions): add session list with zustand store and view model
fix(auth): handle expired cognito token with silent refresh
refactor(parking): extract price calculation to domain value object
perf(sessions): select individual store slices to prevent re-renders
chore(deps): upgrade zustand to v5
docs(gemini): update architecture layer rules
```

---

## Branches

```
main                                    # Producción — solo merge via PR
develop                                 # Integración
feature/<ticket>-<descripcion-corta>    # Nueva feature
fix/<ticket>-<descripcion-corta>        # Bug fix
refactor/<descripcion-corta>            # Refactoring
hotfix/<descripcion-corta>              # Fix urgente en main
```

Ejemplos:

```
feature/INS-142-session-dashboard
fix/INS-201-pagination-offset
hotfix/cognito-token-expiry
```

---

## Reglas de PR

- ✅ Título del PR sigue formato Conventional Commits.
- ✅ Descripción incluye: qué cambia, por qué, cómo probar.
- ❌ Sin merge sin al menos 1 aprobación.
- ❌ Sin commits directos a `main` o `develop`.

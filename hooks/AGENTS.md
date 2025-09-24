<!-- AGENTS-META {"title":"React Hooks Directory","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/hooks","tags":["layer:frontend","domain:ui","type:hooks","status:stable"],"status":"stable"} -->

# Hooks Directory (`/hooks`)

## Persona
**Name:** `{hooks_persona_name}` = "Reusable State & Effects Author"  
**Role:** "I encapsulate view-agnostic client logic (state, effects, subscriptions) into composable React hooks that improve reuse, testability, and separation of concerns."  
**Primary Goals:**  

1. Abstract repeated UI logic (media queries, auth state, streaming).  
2. Keep side-effects localized & predictable.  
3. Expose stable return shapes for consuming components.  
4. Avoid business/policy logic leakage (delegate to services or agents).

**MUST:**  

- Use `use` prefix and follow React rules of hooks.  
- Remain framework-safe (no direct DOM unless necessary & guarded).  
- Provide cleanup for subscriptions/timeouts.  
- Keep return contract documented (object vs tuple) & stable.

**FORBIDDEN:**  

- Embedding API secret handling.  
- Mutating global singletons.  
- Mixing unrelated concerns (split into smaller hooks).  
- Returning shape that changes conditionally without clear typing.

## Purpose
Central repository for shared React logic consumed across components, pages, and Cedar-integrated UI without duplicating imperative code.

## Example Pattern

```ts
// use-mobile.ts
import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function update() { setIsMobile(window.innerWidth < breakpoint); }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return { isMobile };
}
```

## Best Practices

| Area | Guidance |
|------|----------|
| Return Shape | Prefer object for extensibility (`{ isMobile }`) |
| Cleanup | Always clean event listeners & intervals |
| SSR Safety | Guard `window` / `document` references |
| Typing | Export explicit return type when complex |
| Composition | Layer small hooks instead of one giant hook |

## Anti-Patterns

| Pattern | Issue | Fix |
|---------|-------|-----|
| Hook does fetch + DOM + state machine | Hard to test | Split responsibilities |
| Returns array with many positions | Opaque API | Use named object |
| Hidden global mutation | Side-effects leak | Encapsulate or move to service |
| Conditional early returns altering shape | Unreliable consumers | Normalize default structure |

## Checklist

- [ ] Hook name prefixed with `use`.  
- [ ] Cleanup implemented.  
- [ ] Return structure documented.  
- [ ] No business logic embedded.  
- [ ] SSR guards in place (if accessing browser APIs).

## Future Enhancements

- Shared suspense/cache layer for expensive computations.  
- Testing harness examples (Vitest + React Testing Library).  
- Lint rule doc referencing exhaustive deps patterns.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized hook directory documentation added |

## Legacy Content
No prior file existed; nothing to preserve.

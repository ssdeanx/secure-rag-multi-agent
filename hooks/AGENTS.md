<!-- AGENTS-META {"title":"React Hooks Directory","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/hooks","tags":["layer:frontend","domain:ui","type:hooks","status":"stable"],"status":"stable"} -->

# Hooks Directory (`/hooks`)

## Persona

**Name:** `{hooks_persona_name}` = "Reusable State & Effects Author"
**Role:** "I encapsulate view-agnostic client logic (state, effects, subscriptions) into composable React hooks that improve reuse, testability, and separation of concerns."

## Purpose

This directory contains shared, reusable React hooks that encapsulate client-side logic (e.g., state, effects, subscriptions). These hooks are consumed across various UI components to promote code reuse and separate concerns.

## Key Files

| File | Description |
| --- | --- |
| `use-mobile.ts` | Exports the `useIsMobile` hook, which returns `true` if the viewport is below a specific mobile breakpoint. |

## Example Pattern (`use-mobile.ts`)

The following is the actual implementation of the `useIsMobile` hook, which uses the `matchMedia` API for efficient viewport checking.

```ts
import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined
    )

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
        mql.addEventListener('change', onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        return () => mql.removeEventListener('change', onChange)
    }, [])

    return isMobile ?? false
}
```

## Change Log

| Version | Date (UTC) | Change |
| --- | --- | --- |
| 1.1.0 | 2025-10-08 | Synchronized content with source code and updated metadata. |
| 1.0.0 | 2025-09-24 | Initial standardized hook directory documentation. |
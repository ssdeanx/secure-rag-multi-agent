'use client'

const registry = new Map<string, () => void>()

export function registerSheet(id: string, closeFn: () => void) {
    registry.set(id, closeFn)
}

export function unregisterSheet(id: string) {
    registry.delete(id)
}

export function notifyOpen(id: string) {
    for (const [key, closeFn] of registry.entries()) {
        if (key !== id) {
            try {
                closeFn()
            } catch (e) {
                // ignore
            }
        }
    }
}

export function closeAllSheets() {
    for (const closeFn of registry.values()) {
        try {
            closeFn()
        } catch (e) {
            // ignore
        }
    }
}

export default null as unknown as typeof registry

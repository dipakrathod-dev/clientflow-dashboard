import { useCallback, useEffect, useState } from 'react'

function readStoredValue(key, initialValue) {
  if (typeof window === 'undefined') return initialValue
  try {
    const stored = window.localStorage.getItem(key)
    return stored === null ? initialValue : JSON.parse(stored)
  } catch {
    return initialValue
  }
}

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [key, value])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key || event.newValue === null) return
      try {
        setValue(JSON.parse(event.newValue))
      } catch {
        // Ignore malformed values written by another tab.
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  const reset = useCallback(() => setValue(initialValue), [initialValue])
  return [value, setValue, reset]
}

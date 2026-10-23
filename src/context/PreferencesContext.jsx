import { useEffect, useMemo, useReducer } from 'react'
import { PreferencesContext } from './preferencesContext'
import { usePersistentState } from '../hooks/usePersistentState'

const initialState = {
  theme: 'dark',
  sidebarCollapsed: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'theme.toggle':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'theme.set':
      return { ...state, theme: action.theme === 'light' ? 'light' : 'dark' }
    case 'sidebar.toggle':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'sidebar.set':
      return { ...state, sidebarCollapsed: Boolean(action.collapsed) }
    default:
      return state
  }
}

export function PreferencesProvider({ children }) {
  const [storedState, setStoredState] = usePersistentState('clientflow.preferences', initialState)
  const [state, dispatch] = useReducer(reducer, storedState)

  useEffect(() => {
    setStoredState(state)
  }, [setStoredState, state])

  const value = useMemo(() => ({
    ...state,
    toggleTheme: () => dispatch({ type: 'theme.toggle' }),
    setTheme: (theme) => dispatch({ type: 'theme.set', theme }),
    toggleSidebar: () => dispatch({ type: 'sidebar.toggle' }),
    setSidebarCollapsed: (collapsed) => dispatch({ type: 'sidebar.set', collapsed }),
  }), [state])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

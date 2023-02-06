import { createContext, useContext, useReducer } from 'react'
import { authState, childrenProps, authAction } from '../types/Types'

const authenticated: authState = {
  authenticated: true,
  error: false,
  message: 'Authenticated',
  loading: false,
}

const unauthenticated: authState = {
  authenticated: false,
  error: true,
  message: 'Unauthenticated',
  loading: false,
}

const error: authState = {
  authenticated: true,
  error: true,
  message: 'Error',
  loading: false,
}

const success: authState = {
  authenticated: true,
  error: false,
  message: 'Success',
  loading: false,
}

const loading: authState = {
  authenticated: true,
  error: false,
  message: 'Loading..',
  loading: true,
}

export const AuthContext = createContext<authState>(authenticated)
const AuthDispatchContext = createContext<React.Dispatch<authAction> | null>(
  null
)

export function AuthProvider({ children }: childrenProps) {
  const [auth, dispatch] = useReducer(authReducer, authenticated)

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

function authReducer<S>(_state: S, action: authAction): authState {
  switch (action.type) {
    case 'authenticated': {
      return authenticated
    }
    case 'expired': {
      return {
        ...unauthenticated,
        message: action.message ?? unauthenticated.message,
      }
    }
    case 'error': {
      return {
        ...error,
        message: action.message ?? error.message,
      }
    }
    case 'success': {
      return success
    }
    case 'loading': {
      return loading
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext)
}

import { createContext, useContext, useReducer } from 'react';
import { authState, childrenProps, reducerAction } from '../Types'

const authenticated: authState = {
  authenticated: true,
  error: false,
  message: 'Authenticated'
}

const unauthenticated: authState = {
  authenticated: false,
  error: true,
  message: 'Unauthenticated'
}

const error: authState = {
  authenticated: true,
  error: true,
  message: 'Error'
}

const success: authState = {
  authenticated: true,
  error: false,
  message: 'Success'
}

export const AuthContext = createContext<authState>(authenticated);
const AuthDispatchContext = createContext<((action: reducerAction) => void) | null>(null);

export function AuthProvider({ children }: childrenProps) {
  const [auth, dispatch] = useReducer(
    authReducer,
    authenticated
  );

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

function authReducer(_info: any, action: reducerAction) {
  switch (action.type) {
    case 'authenticated': {
      return authenticated
    }
    case 'expired': {
      return {
        ...unauthenticated,
        message: action.message ?? unauthenticated.message
      }
    }
    case 'error': {
      return {
        ...error,
        message: action.message ?? error.message
      }
    }
    case 'success': {
      return success
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}
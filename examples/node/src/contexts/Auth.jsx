import { createContext, useContext, useReducer } from 'react';

const authenticated = {
  authenticated: true,
  error: false,
  message: 'Authenticated'
}

const unauthenticated = {
  authenticated: false,
  error: true,
  message: 'Unauthenticated'
}

const error = {
  authenticated: true,
  error: true,
  message: 'Error'
}

const success = {
  authenticated: true,
  error: false,
  message: 'Success'
}

export const AuthContext = createContext(authenticated);
export const AuthDispatchContext = createContext(null);

export function AuthProvider({ children }) {
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

function authReducer(info, action) {
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
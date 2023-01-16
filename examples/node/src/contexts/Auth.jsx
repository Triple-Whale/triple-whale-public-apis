import { createContext, useContext, useReducer } from 'react';

const authenticated = {
  authenticated: true,
  message: 'Authenticated'
}

const unauthenticated = {
  authenticated: false,
  message: 'Unauthenticated'
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
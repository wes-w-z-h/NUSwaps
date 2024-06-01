import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { User } from '../types/User';

type AuthState = {
  user: User | null;
};

type AuthAction = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };

type AuthContextType = { state: AuthState; dispatch: Dispatch<AuthAction> };

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// FIXME: Fix the fast refresh issue, extract it if possible
export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

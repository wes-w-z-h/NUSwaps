import {
  Dispatch,
  ReactNode,
  createContext,
  useReducer,
  useEffect,
} from 'react';
import { UserToken } from '../types/User';

type AuthState = {
  user: UserToken | null;
};

type AuthAction = { type: 'LOGIN'; payload: UserToken } | { type: 'LOGOUT' };

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

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user !== null) {
      dispatch({
        type: 'LOGIN',
        payload: JSON.parse(user),
      });
    }
  }, []);

  console.log(state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

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

type AuthAction =
  | { type: 'LOGIN'; payload: UserToken }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH'; payload: UserToken };

type AuthContextType = {
  authState: AuthState;
  authDispatch: Dispatch<AuthAction>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    case 'REFRESH':
      return { user: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user !== null) {
      authDispatch({
        type: 'LOGIN',
        payload: JSON.parse(user),
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

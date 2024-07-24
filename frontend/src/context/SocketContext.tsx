import {
  ReactNode,
  createContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { Socket } from 'socket.io-client';
import { UserToken } from '../types/User';
import { connectSocket } from '../util/socketio';

type SocketState = Socket | null;

type SocketAction =
  | { type: 'CONNECT'; payload: UserToken }
  | { type: 'DISCONNECT' };

type SocketContextType = {
  socketState: SocketState;
  socketDispatch: Dispatch<SocketAction>;
};

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);

const socketReducer = (state: SocketState, action: SocketAction) => {
  switch (action.type) {
    case 'CONNECT':
      return connectSocket(action.payload);
    case 'DISCONNECT':
      state?.emit('disconnect-user');
      return null;
    default:
      return state;
  }
};

export const SocketContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socketState, socketDispatch] = useReducer(socketReducer, null);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user !== null && socketState === null) {
      socketDispatch({
        type: 'CONNECT',
        payload: JSON.parse(user),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

import {
  ReactNode,
  createContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { Bounce, toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import { UserToken } from '../types/User';

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

const connectSocket = (user: UserToken) => {
  const ws = io('http://localhost:4000');
  ws.on('connect', () => {
    console.log('here');
    ws.emit('ping');

    ws.on('pong', (data) => {
      console.log(data);
    });

    ws.on('match', (match) => {
      console.log('Match found', match);

      toast.success(
        `🦄 Match found for ${match.courseId}-${match.lessonType}!`,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        }
      );
    });
  });

  console.log(ws);
  ws?.emit('user-data', user);

  return ws;
};

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
  }, []);

  return (
    <SocketContext.Provider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

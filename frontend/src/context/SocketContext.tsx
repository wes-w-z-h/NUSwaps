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

    ws.on('match-found', (swap) => {
      console.log('Match found', swap);

      toast.success(
        `🎉🎉🎉 Match found for ${swap.courseId}-${swap.lessonType}!`,
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

    ws.on('match-accepted', (swap) => {
      console.log('Match accepted', swap);

      toast.success(
        ` 🎉🎉🎉 Match for ${swap.courseId}-${swap.lessonType} has been accepted by all parties!`,
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

    ws.on('match-rejected', (swap) => {
      console.log('Match rejected', swap);

      toast.warn(
        `Your match for ${swap.courseId}-${swap.lessonType} has been rejected`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

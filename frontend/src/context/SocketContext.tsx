import { ReactNode, createContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketState = Socket | null;

type SocketContextType = {
  socket: SocketState;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);

export const SocketContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // TODO: Persist state after refresh
  const [socket, setSocket] = useState<SocketState>(null);

  const connectSocket = () => {
    const ws = io('http://localhost:4000');
    ws.on('connect', () => {
      console.log('here');
      ws.emit('ping');

      ws.on('pong', (data) => {
        console.log(data);
      });

      ws.on('match', (swap) => {
        console.log(swap);
      });
    });
    setSocket(ws);
  };

  const disconnectSocket = () => {
    setSocket(null);
  };

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

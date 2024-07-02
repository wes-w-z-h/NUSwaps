import { SocketContext } from '../context/SocketContext.tsx';
import { useContext } from 'react';

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw Error('useAuthContext must be used inside an SocketContextProvider');
  }

  return context;
};

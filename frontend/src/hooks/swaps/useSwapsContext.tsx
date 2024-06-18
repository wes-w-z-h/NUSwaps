import { SwapsContext } from '../../context/SwapsContext';
import { useContext } from 'react';

export const useSwapsContext = () => {
  const context = useContext(SwapsContext);

  if (!context) {
    throw Error('useSwapsContext must be used inside an SwapsContextProvider');
  }

  return context;
};

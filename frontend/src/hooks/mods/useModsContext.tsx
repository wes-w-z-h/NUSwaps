import { ModsContexts } from '../../context/ModsContext';
import { useContext } from 'react';

export const useModsContext = () => {
  const context = useContext(ModsContexts);

  if (!context) {
    throw Error('useModsContext must be used inside an SwapsContextProvider');
  }

  return context;
};

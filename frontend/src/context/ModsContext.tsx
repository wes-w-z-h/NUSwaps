import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { Module, ModuleCode } from '../types/modules';

type ModsState = {
  mods: Module[];
  moduleCodes: ModuleCode[];
};

type ModsAction =
  | { type: 'SET_MODS'; payload: ModuleCode[] }
  | { type: 'SET_MOD'; payload: Module };

type ModsContextType = {
  modsState: ModsState;
  modsDispatch: Dispatch<ModsAction>;
};

export const ModsContexts = createContext<ModsContextType>(
  {} as ModsContextType
);

const swapReducer = (modsState: ModsState, action: ModsAction) => {
  switch (action.type) {
    case 'SET_MODS':
      return { mods: modsState.mods, moduleCodes: action.payload };
    case 'SET_MOD':
      return {
        mods: [...modsState.mods, action.payload],
        moduleCodes: modsState.moduleCodes,
      };
    default:
      return modsState;
  }
};

export const ModsContextsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modsState, modsDispatch] = useReducer(swapReducer, {
    mods: [],
    moduleCodes: [],
  });
  console.log(modsState);
  return (
    <ModsContexts.Provider value={{ modsState, modsDispatch }}>
      {children}
    </ModsContexts.Provider>
  );
};

import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import { Module, ModuleCode } from '../types/modules';

type ModsState = {
  mods: Module[];
  moduleCodes: ModuleCode[];
};

type ModsAction =
  | { type: 'SET_MODS'; payload: ModuleCode[] }
  | { type: 'SET_MODS_INFO'; payload: Module[] }
  | { type: 'SET_MOD_INFO'; payload: Module };

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
    case 'SET_MOD_INFO':
      return {
        mods: [...modsState.mods, action.payload],
        moduleCodes: modsState.moduleCodes,
      };
    case 'SET_MODS_INFO':
      return {
        mods: action.payload,
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

  useEffect(() => {
    let stored = localStorage.getItem('modsInfo');
    if (stored !== null) {
      console.log('inside effect info');
      modsDispatch({ type: 'SET_MODS_INFO', payload: JSON.parse(stored) });
    }
    stored = localStorage.getItem('moduleCodes');
    if (stored !== null) {
      console.log('inside effect code');
      modsDispatch({ type: 'SET_MODS', payload: JSON.parse(stored) });
    }
  }, []);
  console.log(modsState);
  return (
    <ModsContexts.Provider value={{ modsState, modsDispatch }}>
      {children}
    </ModsContexts.Provider>
  );
};

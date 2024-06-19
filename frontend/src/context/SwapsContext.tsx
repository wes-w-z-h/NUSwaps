import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { Swap } from '../types/Swap';

type SwapsState = {
  swaps: Swap[];
};

type SwapsAction =
  | { type: 'SET_SWAPS'; payload: Swap[] }
  | { type: 'CREATE_SWAP'; payload: Swap }
  | { type: 'DELETE_SWAP'; payload: Swap }
  | { type: 'UPDATE_SWAP'; payload: Swap };

type SwapsContextType = {
  swapsState: SwapsState;
  swapsDispatch: Dispatch<SwapsAction>;
};

export const SwapsContext = createContext<SwapsContextType>(
  {} as SwapsContextType
);

const swapReducer = (swapsState: SwapsState, action: SwapsAction) => {
  switch (action.type) {
    case 'SET_SWAPS':
      return { swaps: action.payload };
    case 'CREATE_SWAP':
      return { swaps: [action.payload, ...swapsState.swaps] };
    case 'DELETE_SWAP':
      return {
        // remove based on id of the swap obj
        swaps: swapsState.swaps.filter((swap) => swap.id !== action.payload.id),
      };
    case 'UPDATE_SWAP':
      // TODO: check if is by refernce then dont gotta do this
      return {
        swaps: swapsState.swaps.map((swap) =>
          swap.id === action.payload.id ? action.payload : swap
        ),
      };
    default:
      return swapsState;
  }
};

export const SwapsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [swapsState, swapsDispatch] = useReducer(swapReducer, {
    swaps: [],
  });

  return (
    <SwapsContext.Provider value={{ swapsState, swapsDispatch }}>
      {children}
    </SwapsContext.Provider>
  );
};

import { Swap } from './Swap.tsx';

export type UserToken = {
  id: string;
  email: string;
  telegramHandle?: string;
  swapRequests: [Swap];
  token: string;
};

// TODO: are we even using this type
export type User = {
  id: string;
  email: string;
  swapRequests: [Swap];
};

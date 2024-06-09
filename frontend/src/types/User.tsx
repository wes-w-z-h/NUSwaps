import { Swap } from './Swap.tsx';

export type UserToken = {
  id: string;
  email: string;
  swapRequests: [Swap];
  token: string;
};

export type User = {
  id: string;
  email: string;
  swapRequests: [Swap];
};

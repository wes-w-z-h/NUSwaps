import { Swap } from './Swap.tsx';

export type UserToken = {
  id: string;
  username: string;
  swapRequests: [Swap];
  token: string;
};

export type User = {
  id: string;
  username: string;
  swapRequests: [Swap];
};

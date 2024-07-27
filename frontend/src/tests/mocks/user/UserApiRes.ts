import { UserToken } from '../../../types/User';

export const mockId = '123';
export const mockEmail = 'test@u.nus.edu';
export const mockTeleHandle = '@tester';
export const mockSwapRequests = [];
export const mockToken = 'test-token';

export const mockUser: UserToken = {
  id: mockId,
  email: mockEmail,
  telegramHandle: mockTeleHandle,
  swapRequests: mockSwapRequests,
  token: mockToken,
};

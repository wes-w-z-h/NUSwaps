import { UserToken } from '../../../types/User';

export const ID = '123';
export const EMAIL = 'test@u.nus.edu';
export const TELEGRAMHANDLE = '@tester';
export const SWAPREQUESTS = [];
export const TOKEN = 'test-token';

export const standardUser: UserToken = {
  id: ID,
  email: EMAIL,
  telegramHandle: TELEGRAMHANDLE,
  swapRequests: SWAPREQUESTS,
  token: TOKEN,
};

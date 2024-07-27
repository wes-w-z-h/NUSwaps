import { http, HttpResponse } from 'msw';
import { UserToken } from '../../../types/User';
import { mockUser } from '../UserApiRes';
import { mockUnmatchedSwap } from '../SwapApiRes';
import { Swap } from '../../../types/Swap';

export const handlers = [
  http.post('/auth/signup', () => {
    return HttpResponse.json<{ message: string }>({
      message: 'Verification email sent',
    });
  }),

  http.post('/auth/login', () => {
    return HttpResponse.json<UserToken>(mockUser);
  }),

  http.patch('/users/edit', () => {
    return HttpResponse.json<UserToken>(mockUser);
  }),

  http.delete('/users/delete', () => {
    return HttpResponse.json<UserToken>(mockUser);
  }),

  http.get('/undefined/modules/CS1010X.json', () => {
    return HttpResponse.json();
  }),

  http.post('/swaps', () => {
    return HttpResponse.json<Swap>(mockUnmatchedSwap);
  }),
];

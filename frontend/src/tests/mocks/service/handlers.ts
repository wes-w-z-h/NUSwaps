import { http, HttpResponse } from 'msw';
import { UserToken } from '../../../types/User';
import { mockUser } from '../user/UserApiRes';

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
];

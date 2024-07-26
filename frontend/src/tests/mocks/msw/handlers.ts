import { http, HttpResponse } from 'msw';
import { UserToken } from '../../../types/User';
import { standardUser } from '../user/UserApiRes';

export const handlers = [
  http.post('/auth/signup', () => {
    return HttpResponse.json<{ message: string }>({
      message: 'Verification email sent',
    });
  }),

  http.post('/auth/login', () => {
    return HttpResponse.json<UserToken>(standardUser);
  }),

  http.patch('/users/edit', () => {
    return HttpResponse.json<UserToken>(standardUser);
  }),

  http.delete('/users/delete', () => {
    return HttpResponse.json<UserToken>(standardUser);
  }),
];

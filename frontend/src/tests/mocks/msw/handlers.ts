import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/auth/signup', () => {
    return HttpResponse.json({
      message: 'Verification email sent',
    });
  }),
];

import { afterEach, beforeAll, afterAll, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from './mocks/service/node';

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  server.resetHandlers();
});

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

afterAll(() => {
  server.close();
});

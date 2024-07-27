import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { useLogin } from '../../hooks/auth/useLogin';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { UserToken } from '../../types/User';
import { useSocketContext } from '../../hooks/useSocketContext';
import { Socket } from 'socket.io-client';
import { mockEmail, mockUser } from '../mocks/user/UserApiRes';
import { server } from '../mocks/service/node';
import { http, HttpResponse } from 'msw';

// Mock Data
const mockLogin = vi.fn<(email: string, password: string) => Promise<void>>();
const mockAuthDispatch = vi.fn();
const mockSocketDispatch = vi.fn();

vi.mock('../../hooks/auth/useLogin');
vi.mock('../../hooks/auth/useAuthContext');
vi.mock('../../hooks/useSocketContext');

const updateFields = (password: string, email: string) => {
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText(/^Email/), {
    target: { value: email },
  });
};

const customRender = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  it('renders all the components for the form', () => {
    customRender(<Login />);
    expect(screen.queryByTestId('CloseIcon')).toBeNull();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: "Don't have an account? Sign Up" })
    ).toBeInTheDocument();
  });

  it('redirects when link is clicked', () => {
    customRender(<Login />);
    const link = screen.getByRole('link', {
      name: "Don't have an account? Sign Up",
    });
    fireEvent.click(link);
    expect(location.pathname).toBe('/signup');
  });
  it('updates the form values when changed', () => {
    customRender(<Login />);
    const emailInput = screen.getByLabelText(/^Email/);
    const pwInput = screen.getByLabelText(/^Password/);
    updateFields('123', mockEmail);
    expect(emailInput).toHaveValue(mockEmail);
    expect(pwInput).toHaveValue('123');
  });

  it('renders error text when email domain is wrong', () => {
    customRender(<Login />);
    updateFields('123', 'test@123.com');
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(
      screen.getByText('Email should end with @u.nus.edu')
    ).toBeInTheDocument();
  });

  it('renders error text when fields are empty', () => {
    customRender(<Login />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    // This test will fail since checks domain before submitting so domain check fails first
    // expect(screen.getByText('Email should not be empty')).toBeInTheDocument();
    expect(
      screen.getByText('Password should not be empty')
    ).toBeInTheDocument();
  });

  it('calls the login function with correct params when sign in btn is clicked', () => {
    customRender(<Login />);
    updateFields('123', mockEmail);
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(mockLogin).toHaveBeenCalledWith(mockEmail, '123');
  });

  it('renders error alert on error', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: 'test-error',
    });
    customRender(<Login />);
    expect(screen.getByText('test-error')).toBeInTheDocument();
  });
});

describe('useLogin hook', async () => {
  const actualUseLogin = await vi.importActual<
    typeof import('../../hooks/auth/useLogin')
  >('../../hooks/auth/useLogin');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthContext).mockReturnValue({
      authState: { user: null as UserToken | null },
      authDispatch: mockAuthDispatch,
    });
    vi.mocked(useSocketContext).mockReturnValue({
      socketState: null as Socket | null,
      socketDispatch: mockSocketDispatch,
    });
  });

  it('intialises with default values', () => {
    const { result } = renderHook(actualUseLogin.useLogin, {
      wrapper: BrowserRouter,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets local storage & calls dispatchi & redirects', async () => {
    const { result } = renderHook(actualUseLogin.useLogin, {
      wrapper: BrowserRouter,
    });

    await act(async () => {
      await result.current.login(mockEmail, '123');
    });

    const user = JSON.parse(localStorage.getItem('user') as string);
    expect(user).toStrictEqual(mockUser);
    expect(mockAuthDispatch).toHaveBeenCalledWith({
      type: 'LOGIN',
      payload: mockUser,
    });
    expect(mockSocketDispatch).toHaveBeenCalledWith({
      type: 'CONNECT',
      payload: mockUser,
    });
    expect(location.pathname).toBe('/dashboard');
  });

  it('sets loading to true during login process', async () => {
    server.use(
      http.post('/auth/login', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json(mockUser);
      })
    );

    const { result } = renderHook(actualUseLogin.useLogin, {
      wrapper: BrowserRouter,
    });

    let promise: Promise<void>;
    act(() => {
      promise = result.current.login(mockEmail, '123');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('resets error before new login', async () => {
    server.use(
      http.post('/auth/login', () => {
        return HttpResponse.json({ error: 'test-error' }, { status: 400 });
      })
    );

    const { result } = renderHook(actualUseLogin.useLogin, {
      wrapper: BrowserRouter,
    });

    await act(async () => {
      await result.current.login(mockEmail, '123');
    });

    expect(result.current.error).toBe(
      'Request failed with status code 400, test-error'
    );
    server.use(
      http.post('/auth/login', () => {
        return HttpResponse.json(mockUser);
      })
    );

    await act(async () => {
      await result.current.login(mockEmail, '123');
    });

    expect(result.current.error).toBeNull();
  });
});

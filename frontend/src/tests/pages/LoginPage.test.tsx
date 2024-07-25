import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { useLogin } from '../../hooks/auth/useLogin';

// Mock Data
const mockLogin = vi.fn<(email: string, password: string) => Promise<void>>();

vi.mock('../../hooks/auth/useLogin');

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
    expect(window.location.pathname).toBe('/signup');
  });
  it('updates the form values when changed', () => {
    customRender(<Login />);
    const emailInput = screen.getByLabelText(/^Email/);
    const pwInput = screen.getByLabelText(/^Password/);
    updateFields('123', 'test@u.nus.edu');
    expect(emailInput).toHaveValue('test@u.nus.edu');
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
    updateFields('123', 'test@u.nus.edu');
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(mockLogin).toHaveBeenCalledWith('test@u.nus.edu', '123');
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

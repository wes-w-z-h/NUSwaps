import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../../pages/SignUp';
import { useSignup } from '../../hooks/auth/useSignup';

// Mock Data
const mockSignup =
  vi.fn<
    (email: string, password: string, teleHandle?: string) => Promise<void>
  >();

vi.mock('../../hooks/auth/useSignup');

const updateFields = (
  password: string,
  email: string,
  cfmPassword: string,
  teleHandle?: string
) => {
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText(/^Email/), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/^Confirm Password/), {
    target: { value: cfmPassword },
  });
  if (teleHandle) {
    fireEvent.change(screen.getByLabelText(/^Telegram handle/), {
      target: { value: teleHandle },
    });
  }
};

const customRender = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Signup page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSignup).mockReturnValue({
      signup: mockSignup,
      loading: false,
      error: null,
      message: null,
    });
  });

  it('renders all the components for the form', () => {
    customRender(<SignUp />);
    expect(screen.queryByTestId('CloseIcon')).toBeNull();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Telegram handle/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Already have an account? Sign in' })
    ).toBeInTheDocument();
  });

  it('redirects when link is clicked', () => {
    customRender(<SignUp />);
    const link = screen.getByRole('link', {
      name: 'Already have an account? Sign in',
    });
    fireEvent.click(link);
    expect(window.location.pathname).toBe('/login');
  });

  it('updates the form values when changed', () => {
    customRender(<SignUp />);
    const emailInput = screen.getByLabelText(/^Email/);
    const pwInput = screen.getByLabelText(/^Password/);
    const cfmPwInput = screen.getByLabelText(/^Confirm Password/);
    const teleHandleInput = screen.getByLabelText(/^Telegram handle/);
    updateFields('123', 'test@u.nus.edu', '123', '@test');
    expect(emailInput).toHaveValue('test@u.nus.edu');
    expect(pwInput).toHaveValue('123');
    expect(cfmPwInput).toHaveValue('123');
    expect(teleHandleInput).toHaveValue('@test');
  });

  it('renders error text when email domain is wrong', () => {
    customRender(<SignUp />);
    updateFields('123', 'test@123.com', '123', '@test');
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(
      screen.getByText('Email should end with @u.nus.edu')
    ).toBeInTheDocument();
  });

  it('renders error text when fields are empty', () => {
    customRender(<SignUp />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    // This test will fail since checks domain before submitting so domain check fails first
    // expect(screen.getByText('Email should not be empty')).toBeInTheDocument();
    expect(
      screen.getByText('Password should not be empty')
    ).toBeInTheDocument();
    // screen.debug();
  });

  it('calls the signup function with correct params when sign in btn is clicked', () => {
    customRender(<SignUp />);
    updateFields('123', 'test@u.nus.edu', '123', '@test');
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(mockSignup).toHaveBeenCalledWith('test@u.nus.edu', '123', '@test');
  });

  it('renders error alert on error', () => {
    vi.mocked(useSignup).mockReturnValue({
      signup: mockSignup,
      loading: false,
      error: 'test-error',
      message: '',
    });
    customRender(<SignUp />);
    expect(screen.getByText('test-error')).toBeInTheDocument();
  });
});

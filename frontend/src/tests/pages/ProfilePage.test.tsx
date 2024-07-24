import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { mockUserTokenObj } from '../mocks/User';
import { UserToken } from '../../types/User';
import ProfilePage from '../../pages/ProfilePage';

const mockEditUser = vi.fn();
const mockLoading = false;
const mockError = null;
const mockMessage = null;
vi.mock('../../hooks/user/useEditUser', () => {
  return {
    default: () => ({
      editUser: mockEditUser,
      loading: mockLoading,
      error: mockError,
      message: mockMessage,
    }),
  };
});

const mockAuthContext: {
  authState: {
    user: null | UserToken;
  };
  // authDispatch is not important for this test suite
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authDispatch: any;
} = {
  authState: { user: null },
  authDispatch: vi.fn(),
};

const updateFields = (a: string, b: string, c: string, d?: string) => {
  fireEvent.change(screen.getByLabelText(/^Current Password/), {
    target: { value: a },
  });
  fireEvent.change(screen.getByLabelText(/^New Password/), {
    target: { value: b },
  });
  fireEvent.change(screen.getByLabelText(/^Confirm New Password/), {
    target: { value: c },
  });
  if (d) {
    fireEvent.change(screen.getByLabelText(/^Telegram handle/), {
      target: { value: d },
    });
  }
};

// Custom render function to include AuthContext and BrowserRouter
const customRender = (ui: React.ReactElement) => {
  mockAuthContext.authState.user = mockUserTokenObj;
  return render(
    <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>,
    { wrapper: BrowserRouter }
  );
};

describe('Profile page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all the fields', () => {
    customRender(<ProfilePage />);
    // screen.debug();
    expect(screen.getByLabelText(/^Current Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm New Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Telegram handle/)).toBeInTheDocument();
  });

  it('fills telegram handle from the context', () => {
    customRender(<ProfilePage />);
    expect(screen.getByLabelText(/^Telegram handle/)).toHaveValue('@tester');
  });

  it('updates the value on change', () => {
    customRender(<ProfilePage />);
    updateFields('new', 'new', 'new', '@new');
    expect(screen.getByLabelText(/^Current Password/)).toHaveValue('new');
    expect(screen.getByLabelText(/^New Password/)).toHaveValue('new');
    expect(screen.getByLabelText(/^Confirm New Password/)).toHaveValue('new');
    expect(screen.getByLabelText(/^Telegram handle/)).toHaveValue('@new');
  });

  it('shows error when passwords do not match', async () => {
    customRender(<ProfilePage />);
    updateFields('123', 'new', '12345');
    fireEvent.click(screen.getByRole('button', { name: 'Update Profile' }));
    // edit not called on form error
    expect(mockEditUser).not.toHaveBeenCalled();

    // two helper text for the new pw and cnfm pw text box
    await waitFor(
      () => {
        expect(
          screen.getAllByText(
            'New password and confirm password should be the same'
          ).length
        ).toBe(2);
      },
      { timeout: 3000 }
    );
  });

  it('edit user function called on button press', () => {
    customRender(<ProfilePage />);
    updateFields('123', '123', '123', '@abc');
    fireEvent.click(screen.getByRole('button', { name: 'Update Profile' }));
    expect(mockEditUser).toHaveBeenCalled();
  });
});

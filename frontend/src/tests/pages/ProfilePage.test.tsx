import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { mockUserTokenObj } from '../mocks/User';
import { UserToken } from '../../types/User';
import ProfilePage from '../../pages/ProfilePage';
import useEditUser from '../../hooks/user/useEditUser';
import useDeleteUser from '../../hooks/user/useDeleteUser';

// Mock Data
const mockLoading = false;
const mockMessage: null | string = null;
const mockError: null | string = null;
const mockEditUser =
  vi.fn<
    (
      oldPassword: string,
      newPassword: string,
      teleHandle: string
    ) => Promise<void>
  >();
const mockAuthContext = {
  authState: { user: null as UserToken | null },
  authDispatch: vi.fn(),
};
const mockDeleteUser = vi.fn<() => Promise<void>>();

// Mock Hook
vi.mock('../../hooks/user/useEditUser');
vi.mock('../../hooks/user/useDeleteUser');

const updateFields = (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  telegramHandle?: string
) => {
  fireEvent.change(screen.getByLabelText(/^Current Password/), {
    target: { value: currentPassword },
  });
  fireEvent.change(screen.getByLabelText(/^New Password/), {
    target: { value: newPassword },
  });
  fireEvent.change(screen.getByLabelText(/^Confirm New Password/), {
    target: { value: confirmNewPassword },
  });
  if (telegramHandle) {
    fireEvent.change(screen.getByLabelText(/^Telegram handle/), {
      target: { value: telegramHandle },
    });
  }
};

const customRender = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>,
    { wrapper: BrowserRouter }
  );
};

describe('Profile Page', () => {
  mockAuthContext.authState.user = mockUserTokenObj;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditUser).mockReturnValue({
      editUser: mockEditUser,
      loading: mockLoading,
      error: mockError,
      message: mockMessage,
    });
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      loading: false,
      error: null,
    });
  });

  it('renders the form with all the fields', () => {
    customRender(<ProfilePage />);
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
    updateFields('current', 'new', 'new', '@new');
    expect(screen.getByLabelText(/^Current Password/)).toHaveValue('current');
    expect(screen.getByLabelText(/^New Password/)).toHaveValue('new');
    expect(screen.getByLabelText(/^Confirm New Password/)).toHaveValue('new');
    expect(screen.getByLabelText(/^Telegram handle/)).toHaveValue('@new');
  });

  it('shows error when passwords do not match', async () => {
    customRender(<ProfilePage />);
    updateFields('123', 'new', '12345');
    fireEvent.click(screen.getByRole('button', { name: 'Update Profile' }));

    // editUser should not be called on form error
    expect(mockEditUser).not.toHaveBeenCalled();

    // Validate error message for mismatched passwords
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

  it('calls editUser function on with correct params on button press', async () => {
    customRender(<ProfilePage />);
    updateFields('123', '123', '123', '@abc');
    fireEvent.click(screen.getByRole('button', { name: 'Update Profile' }));
    expect(mockEditUser).toHaveBeenCalledWith('123', '123', '@abc');
  });

  it('renders alert on message or error', () => {
    vi.mocked(useEditUser).mockReturnValue({
      editUser: mockEditUser,
      loading: mockLoading,
      error: 'test-error',
      message: 'test-message',
    });

    customRender(<ProfilePage />);
    expect(screen.getByText('test-error')).toBeInTheDocument();
    expect(screen.getByText('test-message')).toBeInTheDocument();
  });

  it('renders delete dialog when delete acct button clicked & calls hook when delete clicked', () => {
    customRender(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    // screen.debug();
    expect(
      screen.getByText(
        'Are you sure you want to delete your account? This action is irreversible.'
      )
    ).toBeInTheDocument();
    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(mockDeleteUser).toHaveBeenCalledOnce();
  });
});

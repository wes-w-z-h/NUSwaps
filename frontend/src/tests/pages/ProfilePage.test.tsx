import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import React, { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UserToken } from '../../types/User';
import ProfilePage from '../../pages/ProfilePage';
import useEditUser from '../../hooks/user/useEditUser';
import useDeleteUser from '../../hooks/user/useDeleteUser';
import { standardUser, TELEGRAMHANDLE } from '../mocks/user/UserApiRes';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/msw/node';

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
  mockAuthContext.authState.user = standardUser;

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

describe('useEditUser hook', async () => {
  const actualUseEditUser = await vi.importActual<
    typeof import('../../hooks/user/useEditUser')
  >('../../hooks/user/useEditUser');

  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </BrowserRouter>
  );

  it('initialises with default values', () => {
    const { result } = renderHook(actualUseEditUser.default, {
      wrapper: wrapper,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.message).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets message on successful edit', async () => {
    const { result } = renderHook(actualUseEditUser.default, {
      wrapper: wrapper,
    });

    await act(async () => {
      await result.current.editUser('123', '123', TELEGRAMHANDLE);
    });

    expect(result.current.message).toBe('Profile updated successfully!');
  });

  it('sets loading to true during edit process', async () => {
    server.use(
      http.post('/user/edit', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json(standardUser);
      })
    );

    const { result } = renderHook(actualUseEditUser.default, {
      wrapper: wrapper,
    });

    let promise: Promise<void>;
    act(() => {
      promise = result.current.editUser('123', '123', TELEGRAMHANDLE);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('resets error before next update', async () => {
    server.use(
      http.patch('/users/edit', () => {
        return HttpResponse.json({ error: 'test-error' }, { status: 400 });
      })
    );

    const { result } = renderHook(actualUseEditUser.default, {
      wrapper: wrapper,
    });

    await act(async () => {
      await result.current.editUser('123', '123', TELEGRAMHANDLE);
    });
    console.log(result.current.message);

    expect(result.current.error).toBe(
      'Request failed with status code 400, test-error'
    );

    server.use(
      http.patch('/users/edit', () => {
        return HttpResponse.json(standardUser);
      })
    );

    await act(async () => {
      await result.current.editUser('123', '123', TELEGRAMHANDLE);
    });

    expect(result.current.error).toBeNull();
  });
});

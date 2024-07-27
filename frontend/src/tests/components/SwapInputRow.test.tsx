import '@testing-library/jest-dom';
import React, { useState } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
  act,
} from '@testing-library/react';
import SwapInputRow from '../../components/swap/SwapInputRow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockCS1010X } from '../mocks/ModApiRes';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { BrowserRouter } from 'react-router-dom';
import { server } from '../mocks/service/node';
import { http, HttpResponse } from 'msw';
import { mockSwapArr, mockUnmatchedSwap } from '../mocks/SwapApiRes';
import { useSwapsContext } from '../../hooks/swaps/useSwapsContext';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { UserToken } from '../../types/User';
import { mockUser } from '../mocks/UserApiRes';

// Mock the custom hooks
vi.mock('../../hooks/swaps/useSwapsContext');
vi.mock('../../hooks/auth/useAuthContext');
vi.mock('../../hooks/mods/useModsContext', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('../../hooks/mods/useModsContext')>();
  return {
    useModsContext: () => ({
      modsState: {
        moduleCodes: ['CS2030S', 'CS1010X'],
        mods: [mockCS1010X],
      },
      modsDispatch: mod.useModsContext().modsDispatch,
    }),
  };
});

const mockAuthDispatch = vi.fn();
const mockSwapsDispatch = vi.fn();
const mockSwapsContext = {
  swapsState: { swaps: mockSwapArr },
  swapsDispatch: mockSwapsDispatch,
};
const mockAddSwap = {
  addSwap:
    vi.fn<
      (
        courseId: string,
        lessonType: string,
        current: string,
        request: string
      ) => Promise<void>
    >(),
  loading: false,
  error: null,
};
const mockGetModsInfo = {
  error: null,
  getModInfo: vi.fn(),
  loading: false,
};

const Wrapper = ({ initialOpen = false }) => {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <button value={'clickOpen'} onClick={() => setOpen(!initialOpen)}>
        Open SwapInputRow
      </button>
      <Table>
        <TableBody>
          {open && (
            <SwapInputRow
              setOpen={setOpen}
              addSwap={mockAddSwap}
              getModsInfo={mockGetModsInfo}
            />
          )}
        </TableBody>
      </Table>
    </>
  );
};

const customRender = (ui: React.ReactElement) => {
  render(ui);
};

describe('SwapInputRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSwapsContext).mockReturnValue(mockSwapsContext);
  });

  it('renders correctly', () => {
    customRender(<Wrapper />);
    // screen.debug();
    fireEvent.click(screen.getByRole('button', { name: 'Open SwapInputRow' }));

    // screen.getByRole('combobox', { name: 'rrr' });
    expect(
      screen.getByRole('combobox', { name: 'Course Id' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Lesson Type' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Current' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Request' })
    ).toBeInTheDocument();
  });

  /**
   * Integration test with useUpdateInput hooks, using the actual implementation
   * for that hook instead of a mocked function to fully simulate changing of the
   * inputs by a user
   */
  it('calls addSwap when Add button is clicked with valid inputs', async () => {
    customRender(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'Open SwapInputRow' }));

    const courseIdInput = screen.getByRole('combobox', { name: 'Course Id' });
    const lessonTypeInput = screen.getByRole('combobox', {
      name: 'Lesson Type',
    });
    const currentInput = screen.getByRole('combobox', { name: 'Current' });
    const requestInput = screen.getByRole('combobox', { name: 'Request' });

    fireEvent.mouseDown(courseIdInput);
    fireEvent.click(screen.getByRole('option', { name: 'CS1010X' }));

    fireEvent.mouseDown(lessonTypeInput);
    fireEvent.click(screen.getByRole('option', { name: 'Tutorial' }));

    fireEvent.mouseDown(currentInput);
    fireEvent.click(screen.getByRole('option', { name: '01' }));

    fireEvent.mouseDown(requestInput);
    fireEvent.click(screen.getByRole('option', { name: '03' }));

    expect(courseIdInput).toHaveValue('CS1010X');
    expect(lessonTypeInput).toHaveValue('Tutorial');
    expect(currentInput).toHaveValue('01');
    expect(requestInput).toHaveValue('03');

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Add swap' }));
    });

    expect(mockAddSwap.addSwap).toHaveBeenCalledWith(
      'CS1010X',
      'Tutorial',
      '01',
      '03'
    );
  });

  it('renders error on bad inputs', async () => {
    customRender(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'Open SwapInputRow' }));

    const courseIdInput = screen.getByRole('combobox', { name: 'Course Id' });
    fireEvent.mouseDown(courseIdInput);
    fireEvent.click(screen.getByRole('option', { name: 'CS2030S' }));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Add swap' }));
    });
    expect(screen.getByText('Request is required')).toBeInTheDocument();
    expect(screen.getByText('Current is required')).toBeInTheDocument();
    expect(screen.getByText('LessonType is required')).toBeInTheDocument();
  });
});

describe('useAddSwap hook', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthContext).mockReturnValue({
      authState: { user: mockUser as UserToken | null },
      authDispatch: mockAuthDispatch,
    });
  });
  const actualUseAddSwap = await vi.importActual<
    typeof import('../../hooks/swaps/useAddSwap')
  >('../../hooks/swaps/useAddSwap');

  it('initialises with default values', () => {
    const { result } = renderHook(actualUseAddSwap.useAddSwap, {
      wrapper: BrowserRouter,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets loading to true during add process', async () => {
    server.use(
      http.post('/swaps', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json(mockUnmatchedSwap);
      })
    );

    const { result } = renderHook(actualUseAddSwap.useAddSwap, {
      wrapper: BrowserRouter,
    });
    let promise: Promise<void>;
    act(() => {
      promise = result.current.addSwap('CS1010X', 'Tutorial', '01', '03');
    });

    expect(result.current.loading).toBe(true);
    await waitFor(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('calls the dispatch with correct args', async () => {
    const { result } = renderHook(actualUseAddSwap.useAddSwap, {
      wrapper: BrowserRouter,
    });

    await act(async () => {
      await result.current.addSwap('CS1010X', 'Tutorial', '01', '02');
    });

    expect(mockSwapsDispatch).toHaveBeenCalledWith({
      type: 'CREATE_SWAP',
      payload: mockUnmatchedSwap,
    });
  });
});

import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { UserToken } from '../../types/User';
import { useSocketContext } from '../../hooks/useSocketContext';
import { mockUser } from '../mocks/UserApiRes';
import SwapTable from '../../components/swap/SwapTable';
import { useSwapsContext } from '../../hooks/swaps/useSwapsContext';
import { mockSwapArr } from '../mocks/SwapApiRes';
import { mockCS1010X } from '../mocks/ModApiRes';

// Mock Data
const mockAuthDispatch = vi.fn();
const mockSocketDispatch = vi.fn();
const mockSwapsDispatch = vi.fn();
const mockEditSwap =
  vi.fn<
    (
      id: string,
      courseId: string,
      lessonType: string,
      current: string,
      request: string
    ) => Promise<void>
  >();

const mockAuthContext = {
  authState: { user: mockUser as UserToken | null },
  authDispatch: mockAuthDispatch,
};
const mockSwapsContext = {
  swapsState: { swaps: mockSwapArr },
  swapsDispatch: mockSwapsDispatch,
};

vi.mock('../../hooks/auth/useAuthContext');
vi.mock('../../hooks/useSocketContext');
vi.mock('../../hooks/swaps/useSwapsContext');
vi.mock('../../hooks/swaps/useEditSwap', () => {
  return {
    default: () => ({
      editSwap: mockEditSwap,
      loading: false,
      error: null,
    }),
  };
});
vi.mock('../../hooks/mods/useModsContext', () => {
  return {
    useModsContext: () => ({
      modsState: {
        moduleCodes: ['CS2030S', 'CS1010X'],
        mods: [mockCS1010X],
      },
      modsDispatch: vi.fn(),
    }),
  };
});

const customRender = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Swap table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthContext).mockReturnValue(mockAuthContext);
    vi.mocked(useSocketContext).mockReturnValue({
      socketState: null,
      socketDispatch: mockSocketDispatch,
    });
    vi.mocked(useSwapsContext).mockReturnValue(mockSwapsContext);
  });

  it('renders the headers', () => {
    customRender(<SwapTable />);
    expect(screen.getByText('Course ID')).toBeInTheDocument();
    expect(screen.getByText('Lesson Type')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Request')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it("renders all the user's swaps ", () => {
    customRender(<SwapTable />);
    mockSwapArr.forEach((swap) => {
      expect(
        screen.getByRole('row', {
          name: `${swap.courseId} ${swap.lessonType} ${swap.current} ${swap.request} ${swap.status}`,
        })
      );
    });
  });

  it('renders all icons & buttons', () => {
    customRender(<SwapTable />);
    expect(screen.getAllByTestId('VisibilityIcon').length).toBe(3);
    expect(screen.getAllByTestId('KeyboardArrowDownIcon').length).toBe(3);
    expect(
      screen.getByTestId('AddCircleOutlineRoundedIcon')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add swap' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'view match' }).length).toBe(
      3
    );
    expect(screen.getAllByRole('button', { name: 'expand row' }).length).toBe(
      3
    );
  });

  it('opens the add swap form when add button is clicked', async () => {
    customRender(<SwapTable />);
    const addButton = screen.getByRole('button', { name: 'Add swap' });
    fireEvent.click(addButton);
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
    expect(screen.getByRole('button', { name: 'Cancel' }));
  });

  it('renders confirmed status drawer with correct buttons', () => {
    customRender(<SwapTable />);
    const confirmedRow = screen.getByRole('row', {
      name: 'CS1010X Recitation 1 2 CONFIRMED',
    });
    const confirmedRowBtn = within(confirmedRow).getByRole('button', {
      name: 'expand row',
    });

    // try to open for confirmed row
    fireEvent.click(confirmedRowBtn);
    expect(screen.queryByRole('button', { name: 'edit' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'delete' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'reject' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'confirm' })).toBeNull();
  });

  it('renders matched status drawer with correct buttons', () => {
    customRender(<SwapTable />);
    const matchedRow = screen.getByRole('row', {
      name: 'CS1010X Recitation 1 2 MATCHED',
    });
    const matchedRowBtn = within(matchedRow).getByRole('button', {
      name: 'expand row',
    });

    // open drawer and verify contents for matched
    fireEvent.click(matchedRowBtn);
    expect(screen.getByRole('button', { name: 'reject' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument();
    // end of matched row test
  });

  it('renders unmatched status drawer with correct buttons', () => {
    customRender(<SwapTable />);
    const unmatchedRow = screen.getByRole('row', {
      name: 'CS1010X Recitation 1 2 UNMATCHED',
    });
    const unmatchedRowBtn = within(unmatchedRow).getByRole('button', {
      name: 'expand row',
    });

    // open drawer and verify contents for unmatched
    fireEvent.click(unmatchedRowBtn);
    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
    // end of unmatched row test
  });
});

describe('Edit swap modal', () => {
  const openModal = () => {
    const unmatchedRow = screen.getByRole('row', {
      name: 'CS1010X Recitation 1 2 UNMATCHED',
    });
    fireEvent.click(
      within(unmatchedRow).getByRole('button', { name: 'expand row' })
    );
    const editBtn = screen.getByRole('button', { name: 'edit' });
    fireEvent.click(editBtn);
  };

  it('renders on button press', () => {
    customRender(<SwapTable />);
    openModal();
    expect(screen.getByRole('button', { name: 'Confirm change' }));
  });

  it('renders all input fields correctly', () => {
    customRender(<SwapTable />);
    openModal();
    // screen.debug(screen.getByText('Edit swap'));
    const courseIdInput = screen.getByRole('combobox', { name: 'Course Id' });
    const lessonTypeInput = screen.getByRole('combobox', {
      name: 'Lesson Type',
    });
    const currentInput = screen.getByRole('combobox', { name: 'Current' });
    const requestInput = screen.getByRole('combobox', { name: 'Request' });
    // screen.debug();
    expect(courseIdInput).toHaveValue('CS1010X');
    expect(lessonTypeInput).toHaveValue('Recitation');
    expect(currentInput).toHaveValue('1');
    expect(requestInput).toHaveValue('2');
  });

  it('changes value according to user clicks & calls edit swap with correct params', async () => {
    customRender(<SwapTable />);
    openModal();

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
      fireEvent.click(screen.getByRole('button', { name: 'Confirm change' }));
    });

    expect(mockEditSwap).toHaveBeenCalledWith(
      '123',
      'CS1010X',
      'Tutorial',
      '01',
      '03'
    );
  });
});

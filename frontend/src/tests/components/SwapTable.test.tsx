import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { UserToken } from '../../types/User';
import { useSocketContext } from '../../hooks/useSocketContext';
import { mockUser } from '../mocks/UserApiRes';
import SwapTable from '../../components/swap/SwapTable';
import { AuthContext } from '../../context/AuthContext';
import { useSwapsContext } from '../../hooks/swaps/useSwapsContext';
import { SwapsContext } from '../../context/SwapsContext';
import { mockSwapArr } from '../mocks/SwapApiRes';
import { ModsContexts } from '../../context/ModsContext';
import { useModsContext } from '../../hooks/mods/useModsContext';
import { useAddSwap } from '../../hooks/swaps/useAddSwap';
import { mockCS1010X } from '../mocks/ModApiRes';
import { Module } from '../../types/modules';

// Mock Data
const mockAuthDispatch = vi.fn();
const mockSocketDispatch = vi.fn();
const mockSwapsDispatch = vi.fn();

const mockAuthContext = {
  authState: { user: mockUser as UserToken | null },
  authDispatch: mockAuthDispatch,
};
const mockSwapsContext = {
  swapsState: { swaps: mockSwapArr },
  swapsDispatch: mockSwapsDispatch,
};
const mockModsContext = {
  modsState: {
    mods: [mockCS1010X] as Module[],
    moduleCodes: ['CS1010X'],
  },
  modsDispatch: vi.fn(),
};

vi.mock('../../hooks/auth/useAuthContext');
vi.mock('../../hooks/useSocketContext');
vi.mock('../../hooks/swaps/useSwapsContext');
vi.mock('../../hooks/mods/useModsContext');
vi.mock('../../hooks/swaps/useAddSwap');

const customRender = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <SwapsContext.Provider value={mockSwapsContext}>
          <ModsContexts.Provider value={mockModsContext}>
            {ui}
          </ModsContexts.Provider>
        </SwapsContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
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
    vi.mocked(useModsContext).mockReturnValue(mockModsContext);
    vi.mocked(useAddSwap).mockReturnValue({
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
    });
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
      name: 'CS1010X Recitation 01 02 CONFIRMED',
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
      name: 'CS1010X Recitation 01 02 MATCHED',
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
      name: 'CS1010X Recitation 01 02 UNMATCHED',
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

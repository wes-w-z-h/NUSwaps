import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { mockUserTokenObj } from '../mocks/User';
import { UserToken } from '../../types/User';

const mockLogout = vi.fn();
vi.mock('../../hooks/auth/useLogout', () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

// Mock AuthContext
const mockAuthContext = {
  authState: { user: null as UserToken | null },
  authDispatch: vi.fn(),
};

// Custom render function to include AuthContext and BrowserRouter
const customRender = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>,
    { wrapper: BrowserRouter }
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAuthContext.authState.user = null;
  });

  it('renders two app bars', () => {
    customRender(<Navbar />);
    const allText = screen.queryAllByText('NUSwaps');
    expect(allText.length).toBe(2); // Should find two instances for different screen sizes
  });

  it('shows login and signup when user is not authenticated', () => {
    customRender(<Navbar />);
    expect(screen.queryByText('Login')).not.toBeNull();
    expect(screen.queryByText('Signup')).not.toBeNull();
  });

  it('shows profile, logout, and dashboard when user is authenticated', () => {
    mockAuthContext.authState.user = mockUserTokenObj;
    customRender(<Navbar />);
    expect(screen.queryByText('Profile')).not.toBeNull();
    expect(screen.queryByText('Logout')).not.toBeNull();
    expect(screen.getAllByText('Dashboard').length).toBe(2); // For both screen sizes
  });

  it('navigates to profile page when profile button is clicked', () => {
    mockAuthContext.authState.user = mockUserTokenObj;
    customRender(<Navbar />);
    fireEvent.click(screen.getByText('Profile'));
    expect(window.location.pathname).toBe('/profile');
  });

  it('calls logout function and navigates to home when logout is clicked', () => {
    mockAuthContext.authState.user = mockUserTokenObj;
    customRender(<Navbar />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });
});

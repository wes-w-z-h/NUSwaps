import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomAlert from '../../components/CustomAlert';

describe('CustomAlert component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders based when open with severity and message', () => {
    render(<CustomAlert message={'test alert'} severity="info" />);
    expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeNull();
    expect(screen.queryByTestId('CloseIcon')).not.toBeNull();
  });

  it('closes when close button is clicked', () => {
    render(<CustomAlert message={'test alert'} />);
    expect(screen.queryByText('test alert')).not.toBeNull();
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
    screen.debug();
    expect(screen.queryByText('test alert')).not.toBeVisible();
  });
});

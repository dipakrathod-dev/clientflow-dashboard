import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const renderLogin = () => render(
  <MemoryRouter>
    <Login />
  </MemoryRouter>,
);

describe('Login', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows field validation and avoids authentication for invalid input', async () => {
    const login = vi.fn();
    useAuth.mockReturnValue({
      login,
      loginWithGoogle: vi.fn(),
      formatError: vi.fn(),
    });
    const user = userEvent.setup();

    renderLogin();
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Please correct the highlighted fields.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('trims the email before submitting valid credentials', async () => {
    const login = vi.fn().mockResolvedValue({ user: { uid: 'user-1' } });
    useAuth.mockReturnValue({
      login,
      loginWithGoogle: vi.fn(),
      formatError: vi.fn(),
    });
    const user = userEvent.setup();

    renderLogin();
    await user.type(screen.getByPlaceholderText('name@company.com'), '  alex@example.com  ');
    await user.type(screen.getByPlaceholderText('••••••••'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('alex@example.com', 'secret123', false));
  });
});

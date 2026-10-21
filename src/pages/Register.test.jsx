import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Register from './Register';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const renderRegister = () => render(
  <MemoryRouter>
    <Register />
  </MemoryRouter>,
);

describe('Register', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows required field errors without creating an account', async () => {
    const register = vi.fn();
    useAuth.mockReturnValue({ register, formatError: vi.fn() });
    const user = userEvent.setup();

    renderRegister();
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(screen.getByText('Please correct the highlighted fields.')).toBeInTheDocument();
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('trims registration values before creating an account', async () => {
    const register = vi.fn().mockResolvedValue({ user: { uid: 'user-1' } });
    useAuth.mockReturnValue({ register, formatError: vi.fn() });
    const user = userEvent.setup();

    renderRegister();
    await user.type(screen.getByLabelText('Name'), '  Alex Freelancer  ');
    await user.type(screen.getByLabelText('Email Address'), '  alex@example.com  ');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => expect(register).toHaveBeenCalledWith('alex@example.com', 'secret123', 'Alex Freelancer'));
  });
});

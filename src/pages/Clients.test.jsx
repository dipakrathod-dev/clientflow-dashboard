import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Clients from './Clients';
import { useAuth } from '../hooks/useAuth';
import { addClient, deleteClient, getClients } from '../utils/clientService';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../utils/clientService', () => ({
  addClient: vi.fn(),
  deleteClient: vi.fn(),
  getClients: vi.fn(),
  updateClient: vi.fn(),
}));

const clients = [
  {
    id: 'client-1',
    ownerUid: 'owner-1',
    name: 'Acme Studio',
    email: 'hello@acme.test',
    company: 'Acme',
    budget: 50000,
    status: 'Active',
  },
  {
    id: 'client-2',
    ownerUid: 'owner-1',
    name: 'Beta Works',
    email: 'team@beta.test',
    company: 'Beta',
    budget: 25000,
    status: 'Pending',
  },
];

const renderClients = () => render(<Clients />);

describe('Clients', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('filters loaded client records by the visible search field', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'owner-1' } });
    getClients.mockResolvedValue(clients);
    const user = userEvent.setup();

    renderClients();
    expect(await screen.findByText('Acme Studio')).toBeInTheDocument();
    expect(screen.getByText('Beta Works')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search clients, projects...'), 'acme');

    expect(screen.getByText('Acme Studio')).toBeInTheDocument();
    expect(screen.queryByText('Beta Works')).not.toBeInTheDocument();
    expect(screen.queryByText('No matching clients')).not.toBeInTheDocument();
  });

  it('blocks an empty client form and sends valid form data to Firestore service', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'owner-1' } });
    getClients.mockResolvedValue([]);
    addClient.mockResolvedValue({ id: 'client-new' });
    const user = userEvent.setup();

    renderClients();
    await user.click(screen.getByRole('button', { name: '+ Add Client' }));
    await user.click(screen.getByRole('button', { name: 'Add Client', exact: true }));

    expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(addClient).not.toHaveBeenCalled();

    await user.type(screen.getByRole('textbox', { name: /^Name/ }), 'New Client');
    await user.type(screen.getByRole('textbox', { name: /^Email/ }), 'new@example.com');
    await user.type(screen.getByRole('textbox', { name: /^Company/ }), 'New Co');
    await user.type(screen.getByRole('spinbutton', { name: /^Budget/ }), '12500');
    await user.click(screen.getByRole('button', { name: 'Add Client', exact: true }));

    await waitFor(() => expect(addClient).toHaveBeenCalledWith('owner-1', {
      name: 'New Client',
      email: 'new@example.com',
      company: 'New Co',
      budget: 12500,
      status: 'Active',
    }));
  });

  it('requires confirmation before deleting a client record', async () => {
    useAuth.mockReturnValue({ currentUser: { uid: 'owner-1' } });
    getClients.mockResolvedValueOnce(clients).mockResolvedValueOnce([]);
    deleteClient.mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderClients();
    await screen.findByText('Acme Studio');
    const acmeCard = screen.getByText('Acme Studio').closest('div[class*="rounded-2xl"]');
    await user.click(within(acmeCard).getByRole('button', { name: 'Delete' }));

    expect(screen.getByRole('heading', { name: 'Delete Acme Studio?' })).toBeInTheDocument();
    expect(deleteClient).not.toHaveBeenCalled();

    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(deleteClient).toHaveBeenCalledWith('client-1'));
  });
});

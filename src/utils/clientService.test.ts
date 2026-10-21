import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { addClient, getClients, updateClient } from './clientService';

vi.mock('../firebase/firebase', () => ({
  db: { name: 'test-db' },
}));

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'clients-ref'),
  deleteDoc: vi.fn(),
  doc: vi.fn((...parts) => parts.slice(1).join('/')),
  getDocs: vi.fn(),
  query: vi.fn((...parts) => parts),
  serverTimestamp: vi.fn(() => 'server-time'),
  updateDoc: vi.fn(),
  where: vi.fn((...parts) => parts),
}));

describe('clientService', () => {
  const mockedGetDocs = getDocs as unknown as {
    mockResolvedValue: (value: unknown) => void;
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('rejects writes without an owner and includes owner scoping on valid writes', async () => {
    await expect(addClient('', {
      name: 'Client',
      email: 'client@example.com',
      company: 'Company',
      budget: 1000,
      status: 'Active',
    })).rejects.toThrow('A signed-in account is required.');
    expect(addDoc).not.toHaveBeenCalled();

    await addClient('owner-1', {
      name: 'Client',
      email: 'client@example.com',
      company: 'Company',
      budget: 1000,
      status: 'Active',
    });

    expect(addDoc).toHaveBeenCalledWith('clients-ref', expect.objectContaining({
      ownerUid: 'owner-1',
      createdAt: 'server-time',
      updatedAt: 'server-time',
    }));
  });

  it('returns no records for a signed-out account and scopes reads to the owner', async () => {
    await expect(getClients(null)).resolves.toEqual([]);
    expect(getDocs).not.toHaveBeenCalled();

    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'older',
          data: () => ({ name: 'Older', createdAt: { toMillis: () => 100 } }),
        },
        {
          id: 'newer',
          data: () => ({ name: 'Newer', createdAt: { toMillis: () => 200 } }),
        },
      ],
    });

    await expect(getClients('owner-1')).resolves.toMatchObject([
      { id: 'newer', name: 'Newer' },
      { id: 'older', name: 'Older' },
    ]);
    expect(where).toHaveBeenCalledWith('ownerUid', '==', 'owner-1');
    expect(query).toHaveBeenCalled();
  });

  it('does not allow updates to change the record owner', async () => {
    await updateClient('client-1', {
      name: 'Updated',
      ownerUid: 'attacker',
    });

    expect(doc).toHaveBeenCalledWith({ name: 'test-db' }, 'clients', 'client-1');
    expect(updateDoc).toHaveBeenCalledWith('clients/client-1', {
      name: 'Updated',
      updatedAt: 'server-time',
    });
    expect(deleteDoc).not.toHaveBeenCalled();
  });
});

import type { Timestamp } from 'firebase/firestore';

export type ClientStatus = 'Active' | 'Pending' | 'Completed';

export interface ClientInput {
  name: string;
  email: string;
  company: string;
  budget: number;
  status: ClientStatus;
}

export interface ClientRecord extends ClientInput {
  id: string;
  ownerUid: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

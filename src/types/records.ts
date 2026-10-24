import type { Timestamp } from 'firebase/firestore';

export type ProjectStatus = 'Active' | 'Pending' | 'Completed';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface OwnedRecord {
  id: string;
  ownerUid: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ClientRecord extends OwnedRecord {
  name: string;
  email: string;
  company: string;
  budget: number;
  status: ProjectStatus;
}

export interface ProjectRecord extends OwnedRecord {
  name: string;
  client: string;
  progress: number;
  deadline: string;
  status: ProjectStatus;
  budget: number;
}

export interface InvoiceRecord extends OwnedRecord {
  invoiceNumber: string;
  client: string;
  project: string;
  amount: number;
  paymentMethod: string;
  dueDate: string;
  status: InvoiceStatus;
}

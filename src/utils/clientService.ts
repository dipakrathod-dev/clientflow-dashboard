import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { ClientInput, ClientRecord } from '../types/client';

const CLIENTS_REF = collection(db, 'clients');

export const addClient = async (ownerUid: string | null | undefined, clientData: ClientInput) => {
  if (!ownerUid) throw new Error('A signed-in account is required.');
  return addDoc(CLIENTS_REF, {
    ...clientData,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getClients = async (ownerUid: string | null | undefined): Promise<ClientRecord[]> => {
  if (!ownerUid) return [];
  const q = query(CLIENTS_REF, where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((clientDoc) => ({ id: clientDoc.id, ...(clientDoc.data() as DocumentData) }) as ClientRecord)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
};

export const deleteClient = async (id: string) => {
  const clientDoc = doc(db, 'clients', id);
  return deleteDoc(clientDoc);
};

export const updateClient = async (
  id: string,
  updatedData: Partial<ClientInput> & { ownerUid?: string },
) => {
  const clientDoc = doc(db, 'clients', id);
  const { ownerUid: _ownerUid, ...safeData } = updatedData;
  return updateDoc(clientDoc, {
    ...safeData,
    updatedAt: serverTimestamp()
  });
};

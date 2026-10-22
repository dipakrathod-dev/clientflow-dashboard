import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CLIENTS_REF = collection(db, 'clients');

export const addClient = async (ownerUid, clientData) => {
  if (!ownerUid) throw new Error('A signed-in account is required.');
  return await addDoc(CLIENTS_REF, {
    ...clientData,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getClients = async (ownerUid) => {
  if (!ownerUid) return [];
  const q = query(CLIENTS_REF, where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((clientDoc) => ({ id: clientDoc.id, ...clientDoc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
};

export const deleteClient = async (id) => {
  const clientDoc = doc(db, 'clients', id);
  return await deleteDoc(clientDoc);
};

export const updateClient = async (id, updatedData) => {
  const clientDoc = doc(db, 'clients', id);
  const { ownerUid: _ownerUid, ...safeData } = updatedData;
  return await updateDoc(clientDoc, {
    ...safeData,
    updatedAt: serverTimestamp()
  });
};

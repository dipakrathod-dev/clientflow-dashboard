import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CLIENTS_REF = collection(db, 'clients');

export const addClient = async (clientData) => {
  return await addDoc(CLIENTS_REF, {
    ...clientData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getClients = async () => {
  const q = query(CLIENTS_REF, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteClient = async (id) => {
  const clientDoc = doc(db, 'clients', id);
  return await deleteDoc(clientDoc);
};

export const updateClient = async (id, updatedData) => {
  const clientDoc = doc(db, 'clients', id);
  return await updateDoc(clientDoc, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};
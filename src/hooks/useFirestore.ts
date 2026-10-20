import { useEffect, useCallback } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where, type DocumentData, type DocumentReference } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './useAuth';
import { useAsyncState } from './useAsyncState';

export function useFirestore<T extends DocumentData = DocumentData>(collectionName: string) {
  const { currentUser } = useAuth();
  const ownerUid = currentUser?.uid;

  const fetchData = useCallback(async (): Promise<Array<T & { id: string }>> => {
    if (!ownerUid) return [];

    const userCollection = query(
      collection(db, collectionName),
      where('ownerUid', '==', ownerUid)
    );
    const snap = await getDocs(userCollection);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as Array<T & { id: string }>;
  }, [collectionName, ownerUid]);

  const {
    data,
    loading,
    error,
    execute: executeFetch,
  } = useAsyncState(fetchData, { initialData: [], initialLoading: true });

  const addItem = useCallback(async (item: Partial<T>): Promise<DocumentReference> => {
    if (!ownerUid) throw new Error('You must be signed in to add data.');

    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      ownerUid,
      createdAt: serverTimestamp(),
    });

    await executeFetch();
    return docRef;
  }, [collectionName, executeFetch, ownerUid]);

  const removeItem = useCallback(async (id: string) => {
    if (!ownerUid) throw new Error('You must be signed in to delete data.');

    await deleteDoc(doc(db, collectionName, id));
    await executeFetch();
  }, [collectionName, executeFetch, ownerUid]);

  useEffect(() => {
    void executeFetch().catch(() => undefined);
  }, [executeFetch]);

  return { data: data ?? [], loading, error, addItem, removeItem, refetch: executeFetch };
}

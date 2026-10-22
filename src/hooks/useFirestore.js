import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './useAuth';

export function useFirestore(collectionName) {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!currentUser?.uid) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userCollection = query(
        collection(db, collectionName),
        where('ownerUid', '==', currentUser.uid)
      );
      const snap = await getDocs(userCollection);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, currentUser?.uid]);

  const addItem = async (item) => {
    if (!currentUser?.uid) throw new Error('You must be signed in to add data.');
    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      ownerUid: currentUser.uid,
      createdAt: serverTimestamp(),
    });
    await fetchData();
    return docRef;
  };

  const removeItem = async (id) => {
    if (!currentUser?.uid) throw new Error('You must be signed in to delete data.');
    await deleteDoc(doc(db, collectionName, id));
    setData(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, addItem, removeItem, refetch: fetchData };
}

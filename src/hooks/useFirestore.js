import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: serverTimestamp(),
    });
    fetchData();
    return docRef;
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, collectionName, id));
    setData(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return { data, loading, addItem, removeItem, refetch: fetchData };
}
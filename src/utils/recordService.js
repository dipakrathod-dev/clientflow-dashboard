import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const getCollection = (collectionName) => collection(db, collectionName);

export async function getOwnedRecords(collectionName, ownerUid) {
  if (!ownerUid) return [];

  const recordsQuery = query(getCollection(collectionName), where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(recordsQuery);

  return snapshot.docs
    .map((record) => ({ id: record.id, ...record.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

export async function addOwnedRecord(collectionName, ownerUid, recordData) {
  if (!ownerUid) throw new Error('A signed-in account is required.');

  return addDoc(getCollection(collectionName), {
    ...recordData,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateOwnedRecord(collectionName, recordId, recordData) {
  const recordRef = doc(db, collectionName, recordId);
  const { id: _id, ownerUid: _ownerUid, createdAt: _createdAt, ...safeData } = recordData;

  return updateDoc(recordRef, {
    ...safeData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOwnedRecord(collectionName, recordId) {
  return deleteDoc(doc(db, collectionName, recordId));
}

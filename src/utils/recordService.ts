import {
  addDoc,
  collection,
  type CollectionReference,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { OwnedRecord } from '../types/records';

type FirestoreRecord = Record<string, unknown>;

const getCollection = <T extends FirestoreRecord>(collectionName: string) => (
  collection(db, collectionName) as CollectionReference<T>
);

export async function getOwnedRecords<T extends FirestoreRecord>(collectionName: string, ownerUid: string): Promise<Array<T & OwnedRecord>> {
  if (!ownerUid) return [];

  const recordsQuery = query(getCollection<T>(collectionName), where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(recordsQuery);

  return snapshot.docs
    .map((record) => ({ id: record.id, ...record.data() } as T & OwnedRecord))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

export async function addOwnedRecord<T extends FirestoreRecord>(collectionName: string, ownerUid: string, recordData: T) {
  if (!ownerUid) throw new Error('A signed-in account is required.');

  return addDoc(getCollection<T>(collectionName), {
    ...recordData,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateOwnedRecord<T extends FirestoreRecord>(collectionName: string, recordId: string, recordData: Partial<T>) {
  const recordRef = doc(db, collectionName, recordId);
  const { id: _id, ownerUid: _ownerUid, createdAt: _createdAt, ...safeData } = recordData as FirestoreRecord & Partial<OwnedRecord>;

  return updateDoc(recordRef, {
    ...safeData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOwnedRecord(collectionName: string, recordId: string) {
  return deleteDoc(doc(db, collectionName, recordId));
}

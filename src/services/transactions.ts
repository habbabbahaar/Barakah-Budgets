import { db } from '@/lib/firebase';
import type { Transaction } from '@/lib/types';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

// A type guard to check if an object is a Firestore Timestamp
function isTimestamp(value: any): value is Timestamp {
    return value && typeof value.toDate === 'function';
}


export async function getTransactions(): Promise<Transaction[]> {
  const transactionsCol = collection(db, 'transactions');
  const q = query(transactionsCol, orderBy('date', 'desc'));
  const transactionSnapshot = await getDocs(q);
  const transactionList = transactionSnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to JavaScript Date object
    const date = isTimestamp(data.date) ? data.date.toDate() : new Date();
    return {
      id: doc.id,
      ...data,
      date,
    } as Transaction;
  });
  return transactionList;
}

export async function addTransaction(
  transaction: Omit<Transaction, 'id' | 'date'>
): Promise<Transaction> {
  const transactionsCol = collection(db, 'transactions');
  const newTransactionData = {
    ...transaction,
    date: new Date(),
  };
  const docRef = await addDoc(transactionsCol, newTransactionData);

  return {
    ...newTransactionData,
    id: docRef.id,
  };
}

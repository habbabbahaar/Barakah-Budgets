import { db } from '@/lib/firebase';
import type { Transaction } from '@/lib/types';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
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
  
  // Remove paymentSource if it's undefined
  if (newTransactionData.paymentSource === undefined) {
    delete (newTransactionData as Partial<typeof newTransactionData>).paymentSource;
  }

  const docRef = await addDoc(transactionsCol, newTransactionData);

  return {
    ...newTransactionData,
    id: docRef.id,
  };
}

export async function updateTransaction(
  transaction: Transaction
): Promise<void> {
  const transactionRef = doc(db, 'transactions', transaction.id);
  
  const { id, ...dataToUpdate } = transaction;

  // Remove paymentSource if it's undefined
  if (dataToUpdate.paymentSource === undefined) {
    delete (dataToUpdate as Partial<typeof dataToUpdate>).paymentSource;
  }

  await updateDoc(transactionRef, dataToUpdate);
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  const transactionRef = doc(db, 'transactions', transactionId);
  await deleteDoc(transactionRef);
}

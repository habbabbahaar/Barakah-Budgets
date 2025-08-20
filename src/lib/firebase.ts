import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'barakah-budgets-6aiw1',
  appId: '1:451609863234:web:3fa7412c712b1d7bbcb9db',
  storageBucket: 'barakah-budgets-6aiw1.firebasestorage.app',
  apiKey: 'AIzaSyCBcTbYmUEgWXJb07syoMFUXFUKdzERfco',
  authDomain: 'barakah-budgets-6aiw1.firebaseapp.com',
  messagingSenderId: '451609863234',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };

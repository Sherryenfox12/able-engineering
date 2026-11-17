import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyA7K2JRQwXJjZmLVPSQn5OhrZnERu5uRZQ',
  authDomain: 'able-engineer.firebaseapp.com',
  projectId: 'able-engineer',
  storageBucket: 'able-engineer.firebasestorage.app',
  messagingSenderId: '309707962860',
  appId: '1:309707962860:web:98aae41c158136dde128c9',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, db, storage }

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBy1gxZIBGYmDrxmA5lKl3HLAanGTVXOic',
  authDomain: 'able-engineer-c5b67.firebaseapp.com',
  projectId: 'able-engineer-c5b67',
  storageBucket: 'able-engineer-c5b67.firebasestorage.app',
  messagingSenderId: '397004657260',
  appId: '1:397004657260:web:391e876fdc02c9dfe67e49',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, db, storage }

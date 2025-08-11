// Firebase client setup for Next.js, safe during SSR/build
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const isBrowser = typeof window !== 'undefined'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: ReturnType<typeof initializeApp> | undefined
let _auth: ReturnType<typeof getAuth> | undefined
let _db: ReturnType<typeof getFirestore> | undefined
let _storage: ReturnType<typeof getStorage> | undefined
let _googleProvider: GoogleAuthProvider | undefined

if (isBrowser && firebaseConfig.apiKey) {
  app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
  _auth = getAuth(app)
  _db = getFirestore(app)
  _storage = getStorage(app)
  _googleProvider = new GoogleAuthProvider()
}

export const auth = _auth as typeof _auth
export const db = _db as typeof _db
export const storage = _storage as typeof _storage
export const googleProvider = _googleProvider as GoogleAuthProvider | undefined

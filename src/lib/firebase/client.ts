import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth"
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore"
import { FirebaseStorage, getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function validateFirebaseEnv(): void {
  const requiredEntries: Array<[string, string | undefined]> = [
    ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
    ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
    [
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      firebaseConfig.messagingSenderId,
    ],
    ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
  ]

  const missing = requiredEntries
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(", ")}`
    )
  }
}

validateFirebaseEnv()

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)

// Connect to local emulators when running in development
// Set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true in .env.local
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"

if (useEmulator && typeof window !== "undefined") {
  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1"

  try {
    connectFirestoreEmulator(db, host, 8080)
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true })
    console.info(`[Firebase] Connected to local emulators at ${host}`)
  } catch (err) {
    console.warn("[Firebase] Emulator connection warning:", err)
  }
}

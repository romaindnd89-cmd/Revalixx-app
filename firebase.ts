import { getFirestore, Firestore } from 'firebase/firestore';
import * as firebaseAppModule from 'firebase/app';

// Configuration Firebase directe
const firebaseConfig = {
  apiKey: "AIzaSyCOA4Z3C6raeR1sfJ9HRwuV2i1AtrA9Bn0",
  authDomain: "revalixx-web.firebaseapp.com",
  projectId: "revalixx-web",
  storageBucket: "revalixx-web.firebasestorage.app",
  messagingSenderId: "374358793357",
  appId: "1:374358793357:web:1f3f6888e9b83183cd96c4",
  measurementId: "G-C1K2JLSKR1"
};

// Workaround for TypeScript error: Module '"firebase/app"' has no exported member 'initializeApp'
// This happens when the TS environment is using legacy type definitions or has resolution issues with v9 exports.
// We cast the module to any to access the exports that we know exist at runtime in v9.
const appModule = firebaseAppModule as any;
const initializeApp = appModule.initializeApp;
const getApps = appModule.getApps;
const getApp = appModule.getApp;

// Singleton pattern pour éviter les initialisations multiples lors du hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialisation sécurisée de Firestore
let firestoreDb: Firestore;

try {
  firestoreDb = getFirestore(app);
} catch (error) {
  console.error("Firestore initialization failed:", error);
  // En cas d'échec critique (rare si la config est bonne et le module chargé), 
  // on laisse l'erreur remonter ou on exporte null, mais cela casserait l'app ailleurs.
  // La correction principale est dans l'importmap.
}

export const db = firestoreDb!;
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Episode, AIModelSlotConfig } from './types/studio';
import { sanitizeEpisodeForFirestore } from './utils/studioLogic';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutStudioUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function saveEpisodeToFirestore(
  episode: Episode,
  user: User
): Promise<void> {
  const path = `episodes/${episode.id}`;
  try {
    const docData = sanitizeEpisodeForFirestore(episode, user.uid);
    await setDoc(doc(db, 'episodes', docData.id), docData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserEpisodesFromFirestore(user: User): Promise<Episode[]> {
  const path = 'episodes';
  try {
    const q = query(collection(db, 'episodes'), where('ownerId', '==', user.uid));
    const snap = await getDocs(q);
    const episodes: Episode[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && typeof data.payloadJson === 'string') {
        try {
          const parsed = JSON.parse(data.payloadJson) as Episode;
          episodes.push(parsed);
        } catch {
          // ignore malformed payload
        }
      }
    });
    return episodes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteEpisodeFromFirestore(
  episodeId: string
): Promise<void> {
  const cleanId = episodeId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const path = `episodes/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'episodes', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveStudioModelsToFirestore(
  models: AIModelSlotConfig[],
  user: User
): Promise<void> {
  const path = `studio_configs/${user.uid}`;
  try {
    await setDoc(doc(db, 'studio_configs', user.uid), {
      ownerId: user.uid,
      modelsJson: JSON.stringify(models).slice(0, 49000),
      updatedAtIso: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

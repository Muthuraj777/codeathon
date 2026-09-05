import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';

let appInstance: App | null = null;

export const initFirebaseAdmin = (): App | null => {
  if (appInstance || getApps().length > 0) {
    appInstance = getApps()[0] || null;
    return appInstance;
  }

  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  try {
    if (serviceAccountVar) {
      const serviceAccount =
        typeof serviceAccountVar === 'string' ? JSON.parse(serviceAccountVar) : serviceAccountVar;
      appInstance = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
    } else if (projectId) {
      appInstance = initializeApp({
        projectId,
      });
    } else {
      appInstance = initializeApp();
    }
    return appInstance;
  } catch (error) {
    console.warn('[FirebaseAdmin] Initialization warning:', (error as Error).message);
    return null;
  }
};

export const verifyFirebaseToken = async (idToken: string): Promise<DecodedIdToken | null> => {
  try {
    initFirebaseAdmin();
    if (getApps().length === 0) return null;
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.warn('[FirebaseAdmin] ID token verification notice:', (error as Error).message);
    return null;
  }
};

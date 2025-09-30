
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

let adminApp: App;

export async function initializeAdminApp() {
    if (getApps().some(app => app.name === 'admin')) {
       return getApps().find(app => app.name === 'admin')!;
    }
    
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be disabled.");
        return null;
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

    adminApp = initializeApp({
        credential: cert(serviceAccount),
    }, 'admin');

    return adminApp;
}

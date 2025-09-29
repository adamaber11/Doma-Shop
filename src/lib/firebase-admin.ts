
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

let adminApp: App;

export async function initializeAdminApp() {
    if (getApps().some(app => app.name === 'admin')) {
       return getApps().find(app => app.name === 'admin')!;
    }
    
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

    adminApp = initializeApp({
        credential: cert(serviceAccount),
    }, 'admin');

    return adminApp;
}


"use server";
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase-admin';
import type { UserRoleInfo } from '@/lib/types';

async function getAdminAuth() {
    const adminApp = await initializeAdminApp();
    return getAuth(adminApp);
}

export async function getUsers(): Promise<UserRoleInfo[]> {
    const auth = await getAdminAuth();
    const userRecords = await auth.listUsers();
    
    return userRecords.users.map(user => ({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        isAdmin: !!user.customClaims?.admin,
    }));
}

export async function setUserAdminRole(uid: string, isAdmin: boolean): Promise<void> {
    const auth = await getAdminAuth();
    await auth.setCustomUserClaims(uid, { admin: isAdmin });
}

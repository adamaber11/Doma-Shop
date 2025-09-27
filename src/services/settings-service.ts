
"use server";
import { db } from "@/lib/firebase";
import type { HomepageSettings } from "@/lib/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

const settingsCollectionName = 'settings';
const homepageDocName = 'homepage';

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
    try {
        const docRef = doc(db, settingsCollectionName, homepageDocName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as HomepageSettings;
        } else {
            console.log("No homepage settings found!");
            return null;
        }
    } catch (error) {
        console.error("Error getting homepage settings: ", error);
        return null;
    }
}

export async function updateHomepageSettings(settings: HomepageSettings): Promise<void> {
    try {
        const docRef = doc(db, settingsCollectionName, homepageDocName);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error updating homepage settings: ", error);
        throw new Error("Failed to update homepage settings.");
    }
}

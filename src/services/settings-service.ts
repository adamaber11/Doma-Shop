
"use server";
import { db } from "@/lib/firebase";
import type { HomepageSettings, ContactInfoSettings } from "@/lib/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

const settingsCollectionName = 'settings';
const homepageDocName = 'homepage';
const contactInfoDocName = 'contactInfo';

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
    try {
        const docRef = doc(db, settingsCollectionName, homepageDocName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as HomepageSettings;
        } else {
            // Return default settings if none are found
            return {
                heroTitle: "اكتشف أسلوبك",
                heroSubtitle: "استكشف مجموعتنا المنسقة من أجود المنتجات. الجودة والأناقة تصل إلى عتبة داركم.",
                heroImageUrl: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsaXZpbmclMjByb29tfGVufDB8fHx8MTc1ODgwNjQwNXww&ixlib-rb-4.1.0&q=80&w=1080",
            };
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

export async function getContactInfoSettings(): Promise<ContactInfoSettings | null> {
    try {
        const docRef = doc(db, settingsCollectionName, contactInfoDocName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ContactInfoSettings;
        } else {
            // Return default settings if none are found
            return {
                email: "support@doma.com",
                phone: "+1 (555) 123-4567",
                address: "123 شارع التجارة، المدينة الرقمية، 10101",
            };
        }
    } catch (error) {
        console.error("Error getting contact info settings: ", error);
        return null;
    }
}

export async function updateContactInfoSettings(settings: ContactInfoSettings): Promise<void> {
    try {
        const docRef = doc(db, settingsCollectionName, contactInfoDocName);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error updating contact info settings: ", error);
        throw new Error("Failed to update contact info settings.");
    }
}

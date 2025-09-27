

"use server";
import { db } from "@/lib/firebase";
import type { HomepageSettings, ContactInfoSettings, AboutPageSettings, ShippingRate, SocialMediaSettings } from "@/lib/types";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const settingsCollectionName = 'settings';
const homepageDocName = 'homepage';
const contactInfoDocName = 'contactInfo';
const aboutPageDocName = 'aboutPage';
const socialMediaDocName = 'socialMedia';
const shippingRatesCollection = collection(db, 'shippingRates');


// Shipping Rates
export async function getShippingRates(): Promise<ShippingRate[]> {
    const snapshot = await getDocs(shippingRatesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShippingRate));
}

export async function addShippingRate(rate: Omit<ShippingRate, 'id'>): Promise<ShippingRate> {
    const docRef = await addDoc(shippingRatesCollection, rate);
    return { id: docRef.id, ...rate };
}

export async function updateShippingRate(id: string, rate: Partial<ShippingRate>): Promise<void> {
    const docRef = doc(db, 'shippingRates', id);
    await updateDoc(docRef, rate);
}

export async function deleteShippingRate(id: string): Promise<void> {
    const docRef = doc(db, 'shippingRates', id);
    await deleteDoc(docRef);
}


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
                heroImageUrl: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsaXZpbmclMjByb29tfGVufDB8fHx8MTc1ODgwNjQwNXww&ixlib=rb-4.1.0&q=80&w=1080",
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

export async function getAboutPageSettings(): Promise<AboutPageSettings | null> {
    try {
        const docRef = doc(db, settingsCollectionName, aboutPageDocName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AboutPageSettings;
        } else {
            // Return default settings if none are found
            return {
                aboutTitle: "عن دوما",
                aboutSubtitle: "اكتشف القصة وراء العلامة التجارية والتزامنا بالجودة.",
                aboutHeroUrl: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsaXZpbmclMjByb29tfGVufDB8fHx8MTc1ODgwNjQwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                storyTitle: "قصتنا",
                storyContent: "تأسست دوما في عام 2024، وبدأت بفكرة بسيطة: تقديم منتجات عالية الجودة وأنيقة للجميع.",
                missionTitle: "مهمتنا",
                missionContent: "تقديم تجربة تسوق لا مثيل لها مع مجموعة منسقة من المنتجات التي تلهم وتسعد.",
                teamTitle: "فريقنا",
                teamContent: "مجموعة شغوفة من الأفراد ملتزمون برضا العملاء والعثور على أفضل المنتجات لك.",
                journeyTitle: "انضم إلى رحلتنا",
                journeyContent: "نحن في نمو وتطور مستمر. تابعنا على قنوات التواصل الاجتماعي لتبقى على اطلاع على أحدث مجموعاتنا وعروضنا. شكرًا لكونك جزءًا من عائلة دوما.",
            };
        }
    } catch (error) {
        console.error("Error getting about page settings: ", error);
        return null;
    }
}

export async function updateAboutPageSettings(settings: AboutPageSettings): Promise<void> {
    try {
        const docRef = doc(db, settingsCollectionName, aboutPageDocName);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error updating about page settings: ", error);
        throw new Error("Failed to update about page settings.");
    }
}

export async function getSocialMediaSettings(): Promise<SocialMediaSettings | null> {
    try {
        const docRef = doc(db, settingsCollectionName, socialMediaDocName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SocialMediaSettings;
        } else {
            // Return default/empty settings if none are found
            return {
                facebookUrl: "",
                instagramUrl: "",
                tiktokUrl: "",
            };
        }
    } catch (error) {
        console.error("Error getting social media settings: ", error);
        return null;
    }
}

export async function updateSocialMediaSettings(settings: SocialMediaSettings): Promise<void> {
    try {
        const docRef = doc(db, settingsCollectionName, socialMediaDocName);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error updating social media settings: ", error);
        throw new Error("Failed to update social media settings.");
    }
}

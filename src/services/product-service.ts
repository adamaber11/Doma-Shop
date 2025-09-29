

"use server";
import { db } from "@/lib/firebase";
import type { Product, Category, Review, Ad, ContactMessage, Order, Customer } from "@/lib/types";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc, arrayUnion, Timestamp, orderBy, query, runTransaction, where } from "firebase/firestore";

const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');
const adsCollection = collection(db, 'advertisements');
const popupAdsCollection = collection(db, 'popupAds');
const messagesCollection = collection(db, 'contactMessages');
const ordersCollection = collection(db, 'orders');
const customersCollection = collection(db, 'customers');

// Cache variables
let allProducts: Product[] | null = null;
let allCategories: Category[] | null = null;
let allAds: Ad[] | null = null;
let allPopupAds: Ad[] | null = null;
let allMessages: ContactMessage[] | null = null;
let allOrders: Order[] | null = null;
let allCustomers: Customer[] | null = null;

let lastFetchTime: number = 0;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute for dashboard freshness

async function fetchDataIfNeeded(forceRefresh: boolean = false) {
    const now = Date.now();
    if (forceRefresh || now - lastFetchTime > CACHE_DURATION) {
        allProducts = null;
        allCategories = null;
        allAds = null;
        allPopupAds = null;
        allMessages = null;
        allOrders = null;
        allCustomers = null;
        console.log('Cache cleared, fetching new data...');
    }

    if (!allProducts) {
        const productSnapshot = await getDocs(productsCollection);
        allProducts = productSnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.reviews) {
                data.reviews = data.reviews.map((review: any) => ({
                    ...review,
                    createdAt: review.createdAt instanceof Timestamp ? review.createdAt.toDate() : new Date(review.createdAt)
                }));
            }
            return { id: doc.id, ...data } as Product;
        });
    }
    
    if (!allCategories) {
        const categorySnapshot = await getDocs(categoriesCollection);
        const categories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        // This logic is now handled in getCategories to build the hierarchy
        allCategories = categories;
    }

    if (!allAds) {
        const adSnapshot = await getDocs(adsCollection);
        allAds = adSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
    }

    if (!allPopupAds) {
        const popupAdSnapshot = await getDocs(popupAdsCollection);
        allPopupAds = popupAdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
    }

    if (!allMessages) {
        const q = query(messagesCollection, orderBy("createdAt", "desc"));
        const messageSnapshot = await getDocs(q);
        allMessages = messageSnapshot.docs.map(doc => {
             const data = doc.data();
             return { 
                 id: doc.id, 
                 ...data,
                 createdAt: data.createdAt.toDate() 
            } as ContactMessage;
        });
    }

    if (!allOrders) {
        const q = query(ordersCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() } as Order));
    }

    if (!allCustomers) {
        const q = query(customersCollection, orderBy("joinedAt", "desc"));
        const snapshot = await getDocs(q);
        allCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), joinedAt: doc.data().joinedAt.toDate() } as Customer));
    }


    if (forceRefresh || !lastFetchTime) {
      lastFetchTime = now;
    }
}

// Product Functions
export async function getProducts(forceRefresh: boolean = false): Promise<Product[]> {
  await fetchDataIfNeeded(forceRefresh);
  return allProducts || [];
}

export async function getProductById(productId: string): Promise<Product | null> {
    const productDocRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
        const data = productDoc.data();
        // Ensure reviews have Date objects
        if (data.reviews) {
            data.reviews = data.reviews.map((review: any) => ({
                ...review,
                createdAt: review.createdAt instanceof Timestamp ? review.createdAt.toDate() : new Date(review.createdAt)
            }));
        }
        const product = { id: productDoc.id, ...data } as Product;
        
        // Update cache if it exists
        if (allProducts) {
            const index = allProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                allProducts[index] = product;
            } else {
                allProducts.push(product);
            }
        }
        return product;
    }
    
    return null;
}

export async function addProduct(product: Omit<Product, 'id' | 'reviews'>): Promise<Product> {
    const productWithDefaults = {
        ...product,
        reviews: []
    };
    const docRef = await addDoc(productsCollection, productWithDefaults);
    await fetchDataIfNeeded(true);
    const newProduct = { id: docRef.id, ...productWithDefaults } as Product;
    if (allProducts) {
        allProducts.push(newProduct);
    }
    return newProduct;
}

export async function updateProduct(productId: string, productUpdate: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, productUpdate);
    await fetchDataIfNeeded(true); 
}

export async function deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    await fetchDataIfNeeded(true); 
}

export async function addReview(productId: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const productRef = doc(db, 'products', productId);
    const newReview = {
        id: new Date().getTime().toString(),
        ...review,
        createdAt: Timestamp.now(),
    };
    await updateDoc(productRef, {
        reviews: arrayUnion(newReview)
    });
    await fetchDataIfNeeded(true);

    return {
        ...newReview,
        createdAt: newReview.createdAt.toDate()
    };
}

// Category Functions
export async function getCategories(forceRefresh: boolean = false): Promise<Category[]> {
    await fetchDataIfNeeded(forceRefresh);
    const categories = allCategories || [];

    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: add all categories to map
    categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
        if (cat.parentId && categoryMap.has(cat.parentId)) {
            const parent = categoryMap.get(cat.parentId)!;
            parent.subcategories!.push({ id: cat.id, name: cat.name });
        } else {
            // It's a root category
            rootCategories.push(categoryMap.get(cat.id)!);
        }
    });
    
    // Return flat list for dashboard, hierarchy for frontend filtering
    // For now, let's keep it flat as the new dashboard handles hierarchy.
    return categories;
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
    const catDocRef = doc(db, 'categories', categoryId);
    const catDoc = await getDoc(catDocRef);
    if (catDoc.exists()) {
        const category = { id: catDoc.id, ...doc.data() } as Category;
        // Optionally update the cache
        if (allCategories) {
            const index = allCategories.findIndex(c => c.id === categoryId);
            if (index > -1) {
                allCategories[index] = category;
            } else {
                allCategories.push(category);
            }
        }
        return category;
    }
    return null;
}


export async function addCategory(category: Omit<Category, 'id' | 'subcategories'>): Promise<Category> {
    const id = category.name.toLowerCase().replace(/\s+/g, '-') + '-' + new Date().getTime();
    const categoryRef = doc(db, 'categories', id);
    
    const newCategoryData: any = { ...category };
    if (!category.parentId) {
        delete newCategoryData.parentId; // Ensure parentId is not stored if it's a main category
    }

    await setDoc(categoryRef, newCategoryData);
    
    await fetchDataIfNeeded(true);
    const newCategory = { id, ...newCategoryData };
    if(allCategories) {
        allCategories.push(newCategory);
    }
    return newCategory;
}

export async function updateCategory(categoryId: string, categoryUpdate: Partial<Omit<Category, 'id' | 'subcategories'>>): Promise<void> {
    const categoryRef = doc(db, 'categories', categoryId);
    
    const updateData: any = { ...categoryUpdate };
     if (updateData.parentId === undefined) {
        updateData.parentId = deleteField(); // Use FieldValue to remove the field
    }

    await updateDoc(categoryRef, updateData);
    await fetchDataIfNeeded(true);
}


export async function deleteCategory(categoryId: string): Promise<void> {
    await runTransaction(db, async (transaction) => {
        // 1. Delete the main category
        const categoryRef = doc(db, 'categories', categoryId);
        transaction.delete(categoryRef);

        // 2. Find and delete all subcategories
        const subcategoriesQuery = query(collection(db, 'categories'), where('parentId', '==', categoryId));
        const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
        subcategoriesSnapshot.forEach(subDoc => {
            transaction.delete(subDoc.ref);
        });

        // 3. Optional: Unset categoryId and subcategoryId from products.
        // This can be heavy. A better approach might be to handle this in the UI or a batch job.
    });

    await fetchDataIfNeeded(true);
}

export async function deleteSubCategory(parentId: string, subCategoryId: string): Promise<void> {
    // This is simplified. In the new structure, subcategories are just categories with a parentId.
    const subCategoryRef = doc(db, 'categories', subCategoryId);
    await deleteDoc(subCategoryRef);
    await fetchDataIfNeeded(true);
}


// Advertisement Functions (Banners)
export async function getAds(forceRefresh: boolean = false): Promise<Ad[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allAds || [];
}

export async function getAdById(adId: string): Promise<Ad | null> {
    const adDoc = await getDoc(doc(db, 'advertisements', adId));
     if (adDoc.exists()) {
        const newAd = { id: adDoc.id, ...adDoc.data() } as Ad;
        if(allAds){
             const index = allAds.findIndex(ad => ad.id === adId);
            if(index !== -1) allAds[index] = newAd;
            else allAds.push(newAd);
        }
        return newAd;
    }
    return null;
}


export async function addAd(ad: Omit<Ad, 'id'>): Promise<Ad> {
    const docRef = await addDoc(adsCollection, ad);
    await fetchDataIfNeeded(true);
    const newAd = { id: docRef.id, ...ad } as Ad;
    if(allAds) allAds.push(newAd);
    return newAd;
}

export async function updateAd(adId: string, adUpdate: Partial<Ad>): Promise<void> {
    const adRef = doc(db, 'advertisements', adId);
    await updateDoc(adRef, adUpdate);
    await fetchDataIfNeeded(true);
}

export async function deleteAd(adId: string): Promise<void> {
    const adRef = doc(db, 'advertisements', adId);
    await deleteDoc(adRef);
    await fetchDataIfNeeded(true);
}


// Popup Ad Functions
export async function getPopupAds(forceRefresh: boolean = false): Promise<Ad[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allPopupAds || [];
}

export async function getPopupAdById(adId: string): Promise<Ad | null> {
    const adDoc = await getDoc(doc(db, 'popupAds', adId));
     if (adDoc.exists()) {
        const newAd = { id: adDoc.id, ...adDoc.data() } as Ad;
        if(allPopupAds) {
            const index = allPopupAds.findIndex(ad => ad.id === adId);
            if(index !== -1) allPopupAds[index] = newAd;
            else allPopupAds.push(newAd);
        }
        return newAd;
    }
    return null;
}


export async function addPopupAd(ad: Omit<Ad, 'id'>): Promise<Ad> {
    const docRef = await addDoc(popupAdsCollection, ad);
    await fetchDataIfNeeded(true);
    const newAd = { id: docRef.id, ...ad } as Ad;
    if(allPopupAds) allPopupAds.push(newAd);
    return newAd;
}

export async function updatePopupAd(adId: string, adUpdate: Partial<Ad>): Promise<void> {
    const adRef = doc(db, 'popupAds', adId);
    await updateDoc(adRef, adUpdate);
    await fetchDataIfNeeded(true);
}

export async function deletePopupAd(adId: string): Promise<void> {
    const adRef = doc(db, 'popupAds', adId);
    await deleteDoc(adRef);
    await fetchDataIfNeeded(true);
}


// Contact Messages Functions
export async function addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const messageData = {
        ...message,
        createdAt: Timestamp.now()
    }
    const docRef = await addDoc(messagesCollection, messageData);
    await fetchDataIfNeeded(true);
    const newMessage = { id: docRef.id, ...messageData, createdAt: messageData.createdAt.toDate() };
    if (allMessages) {
        allMessages.unshift(newMessage);
    }
    return newMessage;
}

export async function getContactMessages(forceRefresh: boolean = false): Promise<ContactMessage[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allMessages || [];
}

export async function deleteContactMessage(messageId: string): Promise<void> {
    const messageRef = doc(db, 'contactMessages', messageId);
    await deleteDoc(messageRef);
    await fetchDataIfNeeded(true);
}

// Order Functions
export async function getOrders(forceRefresh: boolean = false): Promise<Order[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allOrders || [];
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const orderData = {
        ...order,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(ordersCollection, orderData);
    await fetchDataIfNeeded(true); // Force refresh of orders
    const newOrder: Order = {
        id: docRef.id,
        ...order,
        status: 'pending',
        createdAt: orderData.createdAt.toDate()
    };
    if (allOrders) {
        allOrders.unshift(newOrder); // Add to the top of the list
    }
    return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    await fetchDataIfNeeded(true);
}

// Customer Functions
export async function getCustomers(forceRefresh: boolean = false): Promise<Customer[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allCustomers || [];
}

// Helper to remove a field from a document
import { deleteField } from 'firebase/firestore';

    
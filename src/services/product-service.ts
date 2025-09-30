

"use server";
import { db } from "@/lib/firebase";
import type { Product, Category, Review, Ad, ContactMessage, Order, Customer, Subscriber, UserRoleInfo } from "@/lib/types";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc, arrayUnion, Timestamp, orderBy, query, runTransaction, where } from "firebase/firestore";
import type { User as FirebaseUser } from 'firebase/auth';

const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');
const adsCollection = collection(db, 'advertisements');
const popupAdsCollection = collection(db, 'popupAds');
const messagesCollection = collection(db, 'contactMessages');
const ordersCollection = collection(db, 'orders');
const customersCollection = collection(db, 'customers');
const subscribersCollection = collection(db, 'subscribers');


// Cache variables
let allProducts: Product[] | null = null;
let allCategories: Category[] | null = null;
let allAds: Ad[] | null = null;
let allPopupAds: Ad[] | null = null;
let allMessages: ContactMessage[] | null = null;
let allOrders: Order[] | null = null;
let allCustomers: Customer[] | null = null;
let allSubscribers: Subscriber[] | null = null;

let lastFetchTime: Record<string, number> = {};
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute for dashboard freshness

async function fetchDataIfNeeded(dataType: 'products' | 'categories' | 'ads' | 'popupAds' | 'messages' | 'orders' | 'customers' | 'subscribers', forceRefresh: boolean = false) {
    const now = Date.now();
    if (forceRefresh || !lastFetchTime[dataType] || now - lastFetchTime[dataType] > CACHE_DURATION) {
        console.log(`Cache miss for ${dataType}. Fetching new data...`);
        lastFetchTime[dataType] = now;
        
        switch(dataType) {
            case 'products':
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
                break;
            case 'categories':
                 const categorySnapshot = await getDocs(query(categoriesCollection, orderBy("name")));
                allCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
                break;
            case 'ads':
                const adSnapshot = await getDocs(adsCollection);
                allAds = adSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
                break;
            case 'popupAds':
                const popupAdSnapshot = await getDocs(popupAdsCollection);
                allPopupAds = popupAdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
                break;
            case 'messages':
                const qm = query(messagesCollection, orderBy("createdAt", "desc"));
                const messageSnapshot = await getDocs(qm);
                allMessages = messageSnapshot.docs.map(doc => {
                     const data = doc.data();
                     return { 
                         id: doc.id, 
                         ...data,
                         createdAt: data.createdAt.toDate() 
                    } as ContactMessage;
                });
                break;
            case 'orders':
                const qo = query(ordersCollection, orderBy("createdAt", "desc"));
                const snapshotO = await getDocs(qo);
                allOrders = snapshotO.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() } as Order));
                break;
            case 'customers':
                const qc = query(customersCollection, orderBy("joinedAt", "desc"));
                const snapshotC = await getDocs(qc);
                allCustomers = snapshotC.docs.map(doc => ({ id: doc.id, ...doc.data(), joinedAt: doc.data().joinedAt.toDate() } as Customer));
                break;
            case 'subscribers':
                const qs = query(subscribersCollection, orderBy("subscribedAt", "desc"));
                const snapshotS = await getDocs(qs);
                allSubscribers = snapshotS.docs.map(doc => ({ id: doc.id, ...doc.data(), subscribedAt: doc.data().subscribedAt.toDate() } as Subscriber));
                break;
        }
    }
}

// Product Functions
export async function getProducts(forceRefresh: boolean = false): Promise<Product[]> {
  await fetchDataIfNeeded('products', forceRefresh);
  return allProducts || [];
}

export async function getProductById(productId: string): Promise<Product | null> {
    const productDocRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
        const data = productDoc.data();
        if (data.reviews) {
            data.reviews = data.reviews.map((review: any) => ({
                ...review,
                createdAt: review.createdAt instanceof Timestamp ? review.createdAt.toDate() : new Date(review.createdAt)
            }));
        }
        const product = { id: productDoc.id, ...data } as Product;
        
        await fetchDataIfNeeded('products');
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
    await fetchDataIfNeeded('products', true);
    const newProduct = { id: docRef.id, ...productWithDefaults } as Product;
    return newProduct;
}

export async function updateProduct(productId: string, productUpdate: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, productUpdate);
    await fetchDataIfNeeded('products', true); 
}

export async function deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    await fetchDataIfNeeded('products', true); 
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
    await fetchDataIfNeeded('products', true);

    return {
        ...newReview,
        createdAt: newReview.createdAt.toDate()
    };
}

// Category Functions
export async function getCategories(forceRefresh: boolean = false, flat: boolean = false): Promise<Category[]> {
    await fetchDataIfNeeded('categories', forceRefresh);
    const categories = allCategories || [];

    if (flat) {
        return categories;
    }

    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    categories.forEach(cat => {
        if (cat.parentId) {
            const parent = categoryMap.get(cat.parentId);
            if (parent) {
                parent.subcategories!.push({ id: cat.id, name: cat.name });
            }
        } else {
            rootCategories.push(categoryMap.get(cat.id)!);
        }
    });

    return rootCategories;
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
    const catDocRef = doc(db, 'categories', categoryId);
    const catDoc = await getDoc(catDocRef);
    if (catDoc.exists()) {
        const category = { id: catDoc.id, ...catDoc.data() } as Category;
        await fetchDataIfNeeded('categories');
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
        delete newCategoryData.parentId;
    }

    await setDoc(categoryRef, newCategoryData);
    
    await fetchDataIfNeeded('categories', true);
    const newCategory = { id, ...newCategoryData };
    return newCategory;
}

export async function updateCategory(categoryId: string, categoryUpdate: Partial<Omit<Category, 'id' | 'subcategories'>>): Promise<void> {
    const categoryRef = doc(db, 'categories', categoryId);
    
    const updateData: any = { ...categoryUpdate };
     if (updateData.parentId === undefined) {
        updateData.parentId = deleteField();
    }

    await updateDoc(categoryRef, updateData);
    await fetchDataIfNeeded('categories', true);
}


export async function deleteCategory(categoryId: string): Promise<void> {
    await runTransaction(db, async (transaction) => {
        const categoryRef = doc(db, 'categories', categoryId);
        transaction.delete(categoryRef);

        const subcategoriesQuery = query(collection(db, 'categories'), where('parentId', '==', categoryId));
        const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
        subcategoriesSnapshot.forEach(subDoc => {
            transaction.delete(subDoc.ref);
        });
    });

    await fetchDataIfNeeded('categories', true);
}

export async function deleteSubCategory(parentId: string, subCategoryId: string): Promise<void> {
    const subCategoryRef = doc(db, 'categories', subCategoryId);
    await deleteDoc(subCategoryRef);
    await fetchDataIfNeeded('categories', true);
}


// Advertisement Functions (Banners)
export async function getAds(forceRefresh: boolean = false): Promise<Ad[]> {
    await fetchDataIfNeeded('ads', forceRefresh);
    return allAds || [];
}

export async function getAdById(adId: string): Promise<Ad | null> {
    const adDoc = await getDoc(doc(db, 'advertisements', adId));
     if (adDoc.exists()) {
        const newAd = { id: adDoc.id, ...adDoc.data() } as Ad;
        await fetchDataIfNeeded('ads');
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
    await fetchDataIfNeeded('ads', true);
    const newAd = { id: docRef.id, ...ad } as Ad;
    return newAd;
}

export async function updateAd(adId: string, adUpdate: Partial<Ad>): Promise<void> {
    const adRef = doc(db, 'advertisements', adId);
    await updateDoc(adRef, adUpdate);
    await fetchDataIfNeeded('ads', true);
}

export async function deleteAd(adId: string): Promise<void> {
    const adRef = doc(db, 'advertisements', adId);
    await deleteDoc(adRef);
    await fetchDataIfNeeded('ads', true);
}


// Popup Ad Functions
export async function getPopupAds(forceRefresh: boolean = false): Promise<Ad[]> {
    await fetchDataIfNeeded('popupAds', forceRefresh);
    return allPopupAds || [];
}

export async function getPopupAdById(adId: string): Promise<Ad | null> {
    const adDoc = await getDoc(doc(db, 'popupAds', adId));
     if (adDoc.exists()) {
        const newAd = { id: adDoc.id, ...adDoc.data() } as Ad;
        await fetchDataIfNeeded('popupAds');
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
    await fetchDataIfNeeded('popupAds', true);
    const newAd = { id: docRef.id, ...ad } as Ad;
    return newAd;
}

export async function updatePopupAd(adId: string, adUpdate: Partial<Ad>): Promise<void> {
    const adRef = doc(db, 'popupAds', adId);
    await updateDoc(adRef, adUpdate);
    await fetchDataIfNeeded('popupAds', true);
}

export async function deletePopupAd(adId: string): Promise<void> {
    const adRef = doc(db, 'popupAds', adId);
    await deleteDoc(adRef);
    await fetchDataIfNeeded('popupAds', true);
}


// Contact Messages Functions
export async function addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const messageData = {
        ...message,
        createdAt: Timestamp.now()
    }
    const docRef = await addDoc(messagesCollection, messageData);
    await fetchDataIfNeeded('messages', true);
    const newMessage = { id: docRef.id, ...messageData, createdAt: messageData.createdAt.toDate() };
    return newMessage;
}

export async function getContactMessages(forceRefresh: boolean = false): Promise<ContactMessage[]> {
    await fetchDataIfNeeded('messages', forceRefresh);
    return allMessages || [];
}

export async function deleteContactMessage(messageId: string): Promise<void> {
    const messageRef = doc(db, 'contactMessages', messageId);
    await deleteDoc(messageRef);
    await fetchDataIfNeeded('messages', true);
}

// Order Functions
export async function getOrders(forceRefresh: boolean = false): Promise<Order[]> {
    await fetchDataIfNeeded('orders', forceRefresh);
    return allOrders || [];
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const orderData = {
        ...order,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(ordersCollection, orderData);
    await fetchDataIfNeeded('orders', true);
    const newOrder: Order = {
        id: docRef.id,
        ...order,
        status: 'pending',
        createdAt: orderData.createdAt.toDate()
    };
    return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    await fetchDataIfNeeded('orders', true);
}

// Customer Functions
export async function getCustomers(forceRefresh: boolean = false): Promise<Customer[]> {
    await fetchDataIfNeeded('customers', forceRefresh);
    return allCustomers || [];
}

export async function findOrCreateCustomerFromUser(user: FirebaseUser): Promise<void> {
    const customerRef = doc(db, 'customers', user.uid);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
        const newCustomer: Omit<Customer, 'id'> = {
            name: user.displayName || 'مستخدم جديد',
            email: user.email || '',
            photoURL: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            joinedAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
        };
        await setDoc(customerRef, newCustomer);
        await fetchDataIfNeeded('customers', true);
    }
}


// Subscriber Functions
export async function getSubscribers(forceRefresh: boolean = false): Promise<Subscriber[]> {
    await fetchDataIfNeeded('subscribers', forceRefresh);
    return allSubscribers || [];
}

export async function addSubscriber(email: string): Promise<Subscriber | { error: string, code: string }> {
    const q = query(subscribersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { error: "This email is already subscribed.", code: "already-exists" };
    }

    const subscriberData = {
        email,
        subscribedAt: Timestamp.now()
    };
    const docRef = await addDoc(subscribersCollection, subscriberData);
    await fetchDataIfNeeded('subscribers', true);
    const newSubscriber = { id: docRef.id, ...subscriberData, subscribedAt: subscriberData.subscribedAt.toDate() };
    return newSubscriber;
}

export async function deleteSubscriber(subscriberId: string): Promise<void> {
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await deleteDoc(subscriberRef);
    await fetchDataIfNeeded('subscribers', true);
}


// Helper to remove a field from a document
import { deleteField } from 'firebase/firestore';

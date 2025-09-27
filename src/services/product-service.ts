"use server";
import { db } from "@/lib/firebase";
import type { Product, Category } from "@/lib/types";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');

// Cache variables
let allProducts: Product[] | null = null;
let allCategories: Category[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchDataIfNeeded() {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
        allProducts = null;
        allCategories = null;
    }

    if (!allProducts) {
        const productSnapshot = await getDocs(productsCollection);
        allProducts = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
    
    if (!allCategories) {
        const categorySnapshot = await getDocs(categoriesCollection);
        allCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    }

    lastFetchTime = now;
}

export async function getProducts(): Promise<Product[]> {
  await fetchDataIfNeeded();
  return allProducts || [];
}

export async function getProductById(productId: string): Promise<Product | null> {
    await fetchDataIfNeeded();
    const product = allProducts?.find(p => p.id === productId);
    if (product) {
        return product;
    }
    
    // Fallback to direct fetch if not in cache (e.g., new product)
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() } as Product;
    }
    
    return null;
}

export async function getCategories(): Promise<Category[]> {
    await fetchDataIfNeeded();
    return allCategories || [];
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
    await fetchDataIfNeeded();
    return allCategories?.find(c => c.id === categoryId) || null;
}


"use server";
import { db } from "@/lib/firebase";
import type { Product, Category } from "@/lib/types";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";

const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');

// Cache variables
let allProducts: Product[] | null = null;
let allCategories: Category[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute for dashboard freshness

async function fetchDataIfNeeded(forceRefresh: boolean = false) {
    const now = Date.now();
    if (forceRefresh || now - lastFetchTime > CACHE_DURATION) {
        allProducts = null;
        allCategories = null;
        console.log('Cache cleared, fetching new data...');
    }

    if (!allProducts) {
        const productSnapshot = await getDocs(productsCollection);
        allProducts = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
    
    if (!allCategories) {
        const categorySnapshot = await getDocs(categoriesCollection);
        allCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    }

    if (forceRefresh || !lastFetchTime) {
      lastFetchTime = now;
    }
}

export async function getProducts(forceRefresh: boolean = false): Promise<Product[]> {
  await fetchDataIfNeeded(forceRefresh);
  return allProducts || [];
}

export async function getProductById(productId: string): Promise<Product | null> {
    await fetchDataIfNeeded();
    const product = allProducts?.find(p => p.id === productId);
    if (product) {
        return product;
    }
    
    // Fallback to direct fetch if not in cache
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
        const newProduct = { id: productDoc.id, ...productDoc.data() } as Product;
        // update cache
        if (allProducts) {
            const index = allProducts.findIndex(p => p.id === productId);
            if(index !== -1) allProducts[index] = newProduct;
            else allProducts.push(newProduct);
        }
        return newProduct;
    }
    
    return null;
}

export async function getCategories(forceRefresh: boolean = false): Promise<Category[]> {
    await fetchDataIfNeeded(forceRefresh);
    return allCategories || [];
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
    await fetchDataIfNeeded();
    const category = allCategories?.find(c => c.id === categoryId);
     if (category) {
        return category;
    }
    // Fallback to direct fetch if not in cache
    const catDoc = await getDoc(doc(db, 'categories', categoryId));
    if (catDoc.exists()) {
        const newCat = { id: catDoc.id, ...catDoc.data() } as Category;
        // update cache
        if (allCategories) {
            const index = allCategories.findIndex(c => c.id === categoryId);
            if(index !== -1) allCategories[index] = newCat;
            else allCategories.push(newCat);
        }
        return newCat;
    }

    return null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const docRef = await addDoc(productsCollection, product);
    await fetchDataIfNeeded(true); // Force cache refresh
    const newProduct = { id: docRef.id, ...product };
    if (allProducts) {
        allProducts.push(newProduct);
    }
    return newProduct;
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    // Generate an ID from the name
    const id = category.name.toLowerCase().replace(/\s+/g, '-');
    const categoryRef = doc(db, 'categories', id);
    await setDoc(categoryRef, category);
    await fetchDataIfNeeded(true);
    const newCategory = { id, ...category };
    if(allCategories) {
        allCategories.push(newCategory);
    }
    return newCategory;
}

export async function updateProduct(productId: string, productUpdate: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, productUpdate);
    await fetchDataIfNeeded(true); // Force cache refresh
}

export async function updateCategory(categoryId: string, categoryUpdate: Partial<Category>): Promise<void> {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, categoryUpdate);
    await fetchDataIfNeeded(true); // Force cache refresh
}

export async function deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    await fetchDataIfNeeded(true); // Force cache refresh
}

export async function deleteProducts(productIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    productIds.forEach(productId => {
        const productRef = doc(db, 'products', productId);
        batch.delete(productRef);
    });
    await batch.commit();
    await fetchDataIfNeeded(true); // Force cache refresh
}

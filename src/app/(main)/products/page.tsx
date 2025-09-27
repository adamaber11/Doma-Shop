"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getProducts } from "@/services/product-service";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];
    const category = searchParams.get('category');
    const price = searchParams.get('price');

    if (category) {
      tempProducts = tempProducts.filter(p => p.categoryId === category);
    }

    if (price && typeof price === 'string') {
      const [min, max] = price.split('-').map(Number);
      tempProducts = tempProducts.filter(p => p.price >= min && p.price <= max);
    }
    
    setFilteredProducts(tempProducts);
  }, [searchParams, products]);


  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">منتجاتنا</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          <main className="lg:col-span-3">
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="space-y-2">
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-1/4" />
                   </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">لم يتم العثور على منتجات</h2>
                <p className="text-muted-foreground">حاول تعديل الفلاتر للعثور على ما تبحث عنه.</p>
              </div>
            )}
          </main>
        </div>
      </div>
  );
}



"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getProducts, getAds } from "@/services/product-service";
import type { Product, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const AdCard = ({ ad }: { ad: Ad }) => (
  <Card className="overflow-hidden group">
    <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
      <div className="relative aspect-video">
        <Image
          src={ad.imageUrl}
          alt="Advertisement"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  </Card>
);

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const randomAd = useMemo(() => {
    const activeAds = ads.filter(ad => ad.isActive);
    if (activeAds.length === 0) return null;
    return activeAds[Math.floor(Math.random() * activeAds.length)];
  }, [ads]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedAds] = await Promise.all([
          getProducts(),
          getAds()
        ]);
        setProducts(fetchedProducts);
        setAds(fetchedAds);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      tempProducts = tempProducts.filter(p => {
        const productPrice = p.salePrice ?? p.price;
        return productPrice >= min && productPrice <= max;
      });
    }
    
    setFilteredProducts(tempProducts);
  }, [searchParams, products]);

  const productsWithAd = useMemo(() => {
    if (!randomAd) return filteredProducts.map(p => ({ type: 'product', data: p }));
    
    const items: ( {type: 'product', data: Product} | {type: 'ad', data: Ad} )[] = filteredProducts.map(p => ({ type: 'product', data: p }));
    const middleIndex = Math.floor(items.length / 2);
    
    if (items.length > 3) {
      items.splice(middleIndex, 0, { type: 'ad', data: randomAd });
    }
    return items;
  }, [filteredProducts, randomAd]);


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
            ) : productsWithAd.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsWithAd.map((item, index) => {
                  if (item.type === 'product') {
                    return <ProductCard key={item.data.id} product={item.data} />;
                  }
                  if (item.type === 'ad') {
                    return <div key={`ad-${index}`} className="sm:col-span-2 xl:col-span-1"><AdCard ad={item.data} /></div>;
                  }
                  return null;
                })}
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

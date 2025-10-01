
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts, getPopupAds } from "@/services/product-service";
import type { Product, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Input } from "@/components/ui/input";

function ProductsPageComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [popupAd, setPopupAd] = useState<Ad | null>(null);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedAds] = await Promise.all([
          getProducts(),
          getPopupAds()
        ]);
        setProducts(fetchedProducts);
        
        const adShown = sessionStorage.getItem('adShown');
        if (!adShown) {
            const activeAds = fetchedAds.filter(ad => ad.isActive && (ad.displayPages?.includes('all') || ad.displayPages?.includes('products')));
            if (activeAds.length > 0) {
                const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
                setPopupAd(randomAd);
                setIsAdModalOpen(true);
                sessionStorage.setItem('adShown', 'true');

                if (randomAd.duration && randomAd.duration > 0) {
                    setTimeout(() => setCanCloseAd(true), randomAd.duration * 1000);
                } else {
                    setCanCloseAd(true);
                }
            }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isMounted]);

  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];

    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');
    const searchQuery = searchParams.get('q');
    const filter = searchParams.get('filter');

    if (searchQuery) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filter === 'best-sellers') {
        tempProducts = tempProducts.filter(p => p.isBestSeller);
    }
    if (filter === 'featured') {
        tempProducts = tempProducts.filter(p => p.isFeatured);
    }

    if (subcategoryId) {
        return tempProducts.filter(p => p.subcategoryId === subcategoryId);
    }
    
    if (categoryId) {
        return tempProducts.filter(p => p.categoryId === categoryId || p.subcategoryId && products.find(prod => prod.id === p.subcategoryId)?.categoryId === categoryId);
    }
    
    return tempProducts;

  }, [products, searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
      <div className="container mx-auto px-4 py-8">
        {popupAd && (
            <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
                <DialogContent className="p-0 border-0 max-w-lg" hideCloseButton={!canCloseAd}>
                     <DialogHeader className="p-4 flex flex-row items-center justify-between">
                        <DialogTitle>عرض خاص!</DialogTitle>
                    </DialogHeader>
                    <div className="relative group">
                         <Link href={popupAd.linkUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsAdModalOpen(false)}>
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                src={popupAd.imageUrl}
                                alt="Advertisement"
                                fill
                                className="object-cover"
                                />
                            </div>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block md:w-64 flex-shrink-0">
                <ProductFilters />
            </aside>
            <main className="flex-1 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h1 className="text-3xl font-bold font-headline">كل المنتجات</h1>
                   <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="ابحث في المنتجات..." 
                      className="pr-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                </div>
                 {loading ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {[...Array(12)].map((_, j) => (
                             <div key={j}>
                                <Skeleton className="h-96 w-[180px]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredProducts.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
                                  <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <h2 className="text-2xl font-semibold mb-2">لم يتم العثور على منتجات</h2>
                            <p className="text-muted-foreground">حاول تعديل الفلاتر أو البحث بكلمة أخرى.</p>
                        </div>
                        )}
                    </>
                )}
            </main>
        </div>
      </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsPageComponent />
        </Suspense>
    )
}

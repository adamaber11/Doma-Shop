

"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts, getPopupAds } from "@/services/product-service";
import type { Product, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [popupAds, setPopupAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [randomAd, setRandomAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedAds] = await Promise.all([
          getProducts(),
          getPopupAds()
        ]);
        setProducts(fetchedProducts);
        
        const activeAds = fetchedAds.filter(ad => ad.isActive);
        setPopupAds(activeAds);
        
        const adShown = sessionStorage.getItem('adShown');
        if (!adShown && activeAds.length > 0) {
            setRandomAd(activeAds[Math.floor(Math.random() * activeAds.length)]);
            setIsAdModalOpen(true);
            sessionStorage.setItem('adShown', 'true');
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];
    return tempProducts;
  }, [products]);


  return (
      <div className="container mx-auto px-4 py-8">

        {randomAd && (
            <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
                <DialogContent className="p-0 border-0 max-w-lg">
                     <DialogHeader className="p-4 flex flex-row items-center justify-between">
                        <DialogTitle>عرض خاص!</DialogTitle>
                         <DialogClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                                <span className="sr-only">إغلاق</span>
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="relative group">
                         <Link href={randomAd.linkUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsAdModalOpen(false)}>
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                src={randomAd.imageUrl}
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
        
        <div className="space-y-12">
            
            {loading ? (
                <div className="space-y-12">
                    {[...Array(1)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="flex overflow-x-auto gap-[5px] pb-4">
                                {[...Array(5)].map((_, j) => (
                                <div key={j} className="flex-shrink-0">
                                    <Skeleton className="w-[180px] h-[240px]" />
                                </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <main>
                        <h2 className="text-3xl font-bold font-headline mb-6">كل المنتجات</h2>
                        {filteredProducts.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="flex-shrink-0">
                                   <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <h2 className="text-2xl font-semibold mb-2">لم يتم العثور على منتجات</h2>
                            <p className="text-muted-foreground">حاول تعديل الفلاتر للعثور على ما تبحث عنه.</p>
                        </div>
                        )}
                    </main>
                </>
            )}
        </div>
      </div>
  );
}

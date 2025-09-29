

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

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestOfferProducts, setBestOfferProducts] = useState<Product[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedAds] = await Promise.all([
          getProducts(),
          getPopupAds()
        ]);
        setProducts(fetchedProducts);
        setFeaturedProducts(fetchedProducts.filter(p => p.isFeatured));
        setBestOfferProducts(fetchedProducts.filter(p => p.isBestOffer));

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
                    {[...Array(2)].map((_, i) => (
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
                    {featuredProducts.length > 0 && (
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold font-headline">المنتجات المميزة</h2>
                            </div>
                            <Carousel opts={{ align: "start", direction: 'rtl', loop: featuredProducts.length > 5 }}>
                                <CarouselContent className="flex gap-x-[5px]">
                                    {featuredProducts.map((product) => (
                                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 p-0">
                                            <div className="h-full">
                                                <ProductCard product={product} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </section>
                    )}

                    {bestOfferProducts.length > 0 && (
                         <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold font-headline">أفضل العروض</h2>
                                 <Button variant="ghost" asChild>
                                    <Link href="/offers" className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                                        عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                             <Carousel opts={{ align: "start", direction: 'rtl', loop: bestOfferProducts.length > 5 }}>
                                <CarouselContent className="flex gap-x-[5px]">
                                    {bestOfferProducts.map((product) => (
                                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 p-0">
                                            <div className="h-full">
                                                <ProductCard product={product} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </section>
                    )}
                    
                    <main>
                        <h2 className="text-3xl font-bold font-headline mb-6">كل المنتجات</h2>
                        {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
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

    
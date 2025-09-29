

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { getProducts, getAds, getPopupAds } from "@/services/product-service";
import { getHomepageSettings } from "@/services/settings-service";
import type { Product, HomepageSettings, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/products/ProductCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function Home() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [bestOfferProducts, setBestOfferProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popupAd, setPopupAd] = useState<Ad | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [canCloseAd, setCanCloseAd] = useState(false);

   const plugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true })
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, ads, allProducts, popupAds] = await Promise.all([
          getHomepageSettings(),
          getAds(),
          getProducts(),
          getPopupAds(),
        ]);
        setHomepageSettings(settings);
        setBannerAds(ads.filter(ad => ad.isActive));
        setBestOfferProducts(allProducts.filter(p => p.isBestOffer));
        setBestSellingProducts(allProducts.filter(p => p.isBestSeller));
        setFeaturedProducts(allProducts.filter(p => p.isFeatured));
        
        const activePopupAds = popupAds.filter(ad => ad.isActive && (ad.displayPages?.includes('all') || ad.displayPages?.includes('home')));
        const adShown = sessionStorage.getItem('adShown');

        if (!adShown && activePopupAds.length > 0) {
            const randomAd = activePopupAds[Math.floor(Math.random() * activePopupAds.length)];
            setPopupAd(randomAd);
            setIsAdModalOpen(true);
            sessionStorage.setItem('adShown', 'true');

            if (randomAd.duration && randomAd.duration > 0) {
                 setTimeout(() => setCanCloseAd(true), randomAd.duration * 1000);
            } else {
                setCanCloseAd(true);
            }
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroImage = homepageSettings?.heroImageUrl 
    ? homepageSettings.heroImageUrl
    : getPlaceholderImage('hero-1').imageUrl;
  
  const heroTitle = homepageSettings?.heroTitle || "اكتشف أسلوبك";
  const heroSubtitle = homepageSettings?.heroSubtitle || "استكشف مجموعتنا المنسقة من أجود المنتجات. الجودة والأناقة تصل إلى عتبة داركم.";

  return (
    <>
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
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
        {loading ? (
            <Skeleton className="absolute inset-0" />
        ) : (
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-shadow-md">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto text-shadow">
            {heroSubtitle}
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              تسوق الآن <ShoppingBag className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">أبرز العروض اليوم</h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              استمتع بصفقات الموسم مع خصومات رائعة وعروض استثنائية لفترة محدودة
            </p>
          </div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-full">
                            <Skeleton className="aspect-video w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            ) : bannerAds.length > 0 ? (
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={() => plugin.current.stop()}
                  onMouseLeave={() => plugin.current.reset()}
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {bannerAds.map((ad) => (
                      <CarouselItem key={ad.id} className="basis-full">
                        <div className="p-1">
                           <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-[4/3] sm:aspect-video w-full rounded-lg overflow-hidden">
                                <Image
                                    src={ad.imageUrl}
                                    alt={ad.description || "Advertisement"}
                                    fill
                                    className="object-cover"
                                />
                                {ad.description && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p>{ad.description}</p>
                                    </div>
                                )}
                            </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
            ) : (
                <div className="col-span-3 text-center py-10">
                    <p className="text-muted-foreground">لا توجد بنرات لعرضها حاليًا</p>
                </div>
            )}
        </div>
      </section>
      
       <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">أفضل العروض</h2>
            <Button variant="ghost" asChild>
              <Link href="/offers" className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
           {loading ? (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <Skeleton className="h-96 w-[180px]" />
                  </div>
                ))}
             </div>
           ) : (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {bestOfferProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0">
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
            )}
        </div>
      </section>

       <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">الأكثر مبيعًا</h2>
             <Button variant="ghost" asChild>
                <Link href="/products?filter=best-sellers" className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                    عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
           {loading ? (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <Skeleton className="h-96 w-[180px]" />
                  </div>
                ))}
             </div>
           ) : (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {bestSellingProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0">
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
            )}
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">المنتجات المميزة</h2>
             <Button variant="ghost" asChild>
                <Link href="/products?filter=featured" className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                    عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
           {loading ? (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <Skeleton className="h-96 w-[180px]" />
                  </div>
                ))}
             </div>
           ) : (
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {featuredProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0">
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
            )}
        </div>
      </section>
    </>
  );
}

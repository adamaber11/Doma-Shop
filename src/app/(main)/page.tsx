
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { getProducts, getAds, getPopupAds, getBrands, getPromoCards } from "@/services/product-service";
import { getHomepageSettings } from "@/services/settings-service";
import type { Product, HomepageSettings, Ad, Brand, PromoCard } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/products/ProductCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);
  const [bestOfferProducts, setBestOfferProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [popupAd, setPopupAd] = useState<Ad | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const plugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [settings, ads, offerProducts, sellerProducts, featProducts, popupAds, fetchedBrands, fetchedPromoCards] = await Promise.all([
          getHomepageSettings(),
          getAds(),
          getProducts({ isBestOffer: true }),
          getProducts({ isBestSeller: true }),
          getProducts({ isFeatured: true }),
          getPopupAds(),
          getBrands(),
          getPromoCards(true),
        ]);
        setHomepageSettings(settings);
        setBannerAds(ads.filter(ad => ad.isActive));
        setPromoCards(fetchedPromoCards.filter(card => card.isActive));
        setBestOfferProducts(offerProducts);
        setBestSellingProducts(sellerProducts);
        setFeaturedProducts(featProducts);
        setBrands(fetchedBrands);
        
        const adShown = sessionStorage.getItem('adShown');
        if (!adShown) {
            const activePopupAds = popupAds.filter(ad => ad.isActive && (ad.displayPages?.includes('all') || ad.displayPages?.includes('home')));
            if (activePopupAds.length > 0) {
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
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isMounted]);

  const heroPlaceholder = getPlaceholderImage("hero-1");
  const heroImage = homepageSettings?.heroImageUrl || heroPlaceholder.imageUrl;
  
  return (
    <>
      {popupAd && (
            <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
                <DialogContent className="p-0 border-0 max-w-lg" hideCloseButton={!canCloseAd}>
                     <DialogHeader className="p-4 flex flex-row items-center justify-between">
                        <DialogTitle>عرض خاص!</DialogTitle>
                         <DialogDescription className="sr-only">
                            {popupAd.description || "إعلان عن عرض خاص"}
                        </DialogDescription>
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
      <section className="relative h-screen">
        {loading ? (
            <Skeleton className="absolute inset-0" />
        ) : (
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-10">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {loading ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-64 flex-shrink-0 bg-white/80" />)
              ) : (
                promoCards.map(card => (
                  <div key={card.id} className="w-64 flex-shrink-0">
                    <Card className="p-4 bg-white/90 backdrop-blur-sm flex flex-col shadow-2xl h-full">
                      <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      <Link href={card.linkUrl} className="block flex-grow mb-4">
                        <div className="relative aspect-[0.9] w-full">
                           <Image src={card.imageUrl} alt={card.title} fill className="object-cover rounded-md" sizes="(max-width: 768px) 50vw, 256px"/>
                        </div>
                      </Link>
                      <Link href={card.linkUrl} className="text-sm text-primary hover:underline font-semibold">
                        {card.linkText}
                      </Link>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
               <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold font-headline">أكبر العلامات التجارية على دوما</h2>
              </div>
              {loading ? (
                  <div className="flex gap-8 justify-center overflow-x-auto pb-4 no-scrollbar">
                      {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                              <Skeleton className="h-20 w-20 rounded-full" />
                              <Skeleton className="h-4 w-16" />
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="flex gap-8 justify-center overflow-x-auto pb-4 no-scrollbar">
                      {brands.map(brand => (
                          <Link href={`/brands/${brand.id}`} key={brand.id} className="flex flex-col items-center text-center gap-2 flex-shrink-0 w-24 group">
                              <div className="relative h-20 w-20 rounded-full overflow-hidden border">
                                   <Image src={brand.imageUrl} alt={brand.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                              </div>
                              <span className="text-sm font-medium truncate w-full group-hover:text-primary">{brand.name}</span>
                          </Link>
                      ))}
                  </div>
              )}
          </div>
      </section>


      <section className="py-12 md:py-20">
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
                      <CarouselItem key={ad.id} className="md:basis-1/1 lg:basis-1/1">
                        <div className="p-1">
                           <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-[2.5/1] w-full rounded-lg overflow-hidden">
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

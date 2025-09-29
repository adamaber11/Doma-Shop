

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import { getProducts, getCategories, getAds } from "@/services/product-service";
import { getHomepageSettings } from "@/services/settings-service";
import type { Product, Category, HomepageSettings, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/products/ProductCard";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [bestOfferProducts, setBestOfferProducts] = useState<Product[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, settings, ads, allProducts] = await Promise.all([
          getCategories(),
          getHomepageSettings(),
          getAds(),
          getProducts(),
        ]);
        setCategories(fetchedCategories);
        setHomepageSettings(settings);
        setBannerAds(ads.filter(ad => ad.isActive));
        setBestOfferProducts(allProducts.filter(p => p.isBestOffer));
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


  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  
  const bannerPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <>
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

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">تسوق حسب الفئة</h2>
            <Button variant="ghost" asChild>
              <Link href="/products" className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="flex flex-wrap justify-center gap-8">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-16 rounded-full" />)}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`} className="group flex flex-col items-center gap-2 text-center w-16">
                   <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary group-hover:scale-105 transition-all">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                    </div>
                    <h3 className="font-semibold text-xs text-card-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <Carousel
              opts={{
                align: "start",
                loop: true,
                direction: "rtl",
              }}
              plugins={[bannerPlugin.current]}
              onMouseEnter={bannerPlugin.current.stop}
              onMouseLeave={bannerPlugin.current.play}
              className="w-full"
            >
              <CarouselContent>
                {loading ? (
                  <CarouselItem>
                    <Skeleton className="aspect-[16/6] w-full" />
                  </CarouselItem>
                ) : bannerAds.length > 0 ? (
                    bannerAds.map((ad) => (
                    <CarouselItem key={ad.id}>
                      <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
                        <div className="relative aspect-[16/6] w-full rounded-lg overflow-hidden">
                          <Image
                              src={ad.imageUrl}
                              alt="Advertisement"
                              fill
                              className="object-cover"
                            />
                        </div>
                      </Link>
                    </CarouselItem>
                  ))
                ) : (
                   <CarouselItem>
                      <div className="relative aspect-[16/6] w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                         <p className="text-muted-foreground">لا توجد بنرات لعرضها حاليًا</p>
                      </div>
                    </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
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
             <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-0 flex-shrink-0" style={{flexBasis: 'calc(25% - 12px)'}}>
                    <Skeleton className="h-96 w-full" />
                  </div>
                ))}
             </div>
           ) : (
             <Carousel
                opts={{
                    align: "start",
                    loop: bestOfferProducts.length > 4,
                    direction: 'rtl',
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.play}
                className="w-full"
                >
                <CarouselContent className="flex gap-x-[5px]">
                    {bestOfferProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 p-0">
                         <div className="h-full">
                            <ProductCard product={product} />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 z-10" />
                <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-10" />
             </Carousel>
            )}
        </div>
      </section>
    </>
  );
}

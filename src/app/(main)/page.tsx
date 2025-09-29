
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getProducts, getAds } from "@/services/product-service";
import { getHomepageSettings } from "@/services/settings-service";
import type { Product, HomepageSettings, Ad } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/products/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [bestOfferProducts, setBestOfferProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, ads, allProducts] = await Promise.all([
          getHomepageSettings(),
          getAds(),
          getProducts(),
        ]);
        setHomepageSettings(settings);
        setBannerAds(ads.filter(ad => ad.isActive));
        setBestOfferProducts(allProducts.filter(p => p.isBestOffer));
        setBestSellingProducts(allProducts.filter(p => p.isBestSeller));
        setFeaturedProducts(allProducts.filter(p => p.isFeatured));
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

      <section className="py-12 md:py-20 bg-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">عروض خاصة</h2>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {loading ? (
                [...Array(3)].map((_, i) => (
                    <div key={i}>
                        <Skeleton className="aspect-video w-full rounded-lg" />
                    </div>
                ))
            ) : bannerAds.length > 0 ? (
                bannerAds.slice(0, 3).map((ad) => (
                    <Link key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-video w-full rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
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
                ))
            ) : (
                <div className="col-span-3 text-center py-10">
                    <p className="text-muted-foreground">لا توجد بنرات لعرضها حاليًا</p>
                </div>
            )}
            </div>
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
                    loop: bestSellingProducts.length > 4,
                    direction: 'rtl',
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.play}
                className="w-full"
                >
                <CarouselContent className="flex gap-x-[5px]">
                    {bestSellingProducts.map((product) => (
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
                    loop: featuredProducts.length > 4,
                    direction: 'rtl',
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.play}
                className="w-full"
                >
                <CarouselContent className="flex gap-x-[5px]">
                    {featuredProducts.map((product) => (
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

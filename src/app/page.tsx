
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { allProducts, allCategories } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ArrowRight, ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


export default function Home() {
  const featuredProducts = allProducts.slice(0, 8);
  const bestOffersProducts = allProducts.slice(4, 8);
  const heroImage = getPlaceholderImage('hero-1');


  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
        <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-200">
           <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto h-full flex flex-col items-start justify-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-shadow">
              اكتشف أسلوبك
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl text-shadow">
              استكشف مجموعتنا المنسقة من أجود المنتجات. الجودة والأناقة تصل إلى عتبة داركم.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                تسوق الآن <ShoppingBag className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <Header />

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {allCategories.slice(0, 5).map((category) => {
                 const categoryImage = getPlaceholderImage(category.imageId);
                return (
                <Link key={category.id} href={`/products?category=${category.id}`} className="group">
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="relative aspect-square">
                        <Image
                          src={categoryImage.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={categoryImage.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div className="p-4 bg-card flex-grow flex flex-col justify-center">
                        <h3 className="font-semibold text-center text-card-foreground">{category.name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )})}
            </div>
          </div>
        </section>

        <section className="bg-secondary py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline">المنتجات المميزة</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
                direction: "rtl",
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full"
            >
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline">أفضل العروض</h2>
             <Carousel
              opts={{
                align: "start",
                loop: true,
                direction: "rtl",
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full"
            >
              <CarouselContent>
                {bestOffersProducts.map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                       <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
    </main>
    <Footer />
    </>
  );
}

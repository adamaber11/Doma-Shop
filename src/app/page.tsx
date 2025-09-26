import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { allProducts, allCategories } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const featuredProducts = allProducts.slice(0, 4);
  const heroImage = getPlaceholderImage('hero-1');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
              Discover Your Style
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl text-shadow">
              Explore our curated collection of the finest products. Quality and style delivered to your doorstep.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Link href="/products">
                Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-headline">Shop by Category</h2>
              <Button variant="ghost" asChild>
                <Link href="/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {allCategories.slice(0, 5).map((category) => {
                 const categoryImage = getPlaceholderImage(category.imageId);
                return (
                <Link key={category.id} href={`/products?category=${category.id}`} className="group">
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0">
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
                      <div className="p-4 bg-card">
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

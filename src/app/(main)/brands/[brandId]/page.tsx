
"use client";

import { useEffect, useState } from "react";
import { getProducts, getBrandById } from "@/services/product-service";
import type { Product, Brand } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function BrandPage({ params }: { params: { brandId: string } }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedBrand, fetchedProducts] = await Promise.all([
          getBrandById(params.brandId),
          getProducts({ brandId: params.brandId }),
        ]);

        if (!fetchedBrand) {
          notFound();
        }

        setBrand(fetchedBrand);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch brand data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.brandId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-12">
          <Skeleton className="h-32 w-32 rounded-full mb-4" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-[180px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!brand) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary mb-4">
          <Image
            src={brand.imageUrl}
            alt={brand.name}
            fill
            className="object-contain p-4"
          />
        </div>
        <h1 className="text-4xl font-bold font-headline">{brand.name}</h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
          {products.map((product) => (
            <div key={product.id} className="flex justify-center">
                <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">
            لا توجد منتجات لهذه العلامة التجارية بعد
          </h2>
          <p className="text-muted-foreground mt-2">
            تحقق مرة أخرى قريبًا!
          </p>
        </div>
      )}
    </div>
  );
}

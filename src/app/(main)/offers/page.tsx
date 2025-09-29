
"use client";

import { useEffect, useState } from "react";
import { OfferProductCard } from "@/components/products/OfferProductCard";
import { getProducts } from "@/services/product-service";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PercentCircle } from "lucide-react";

export default function OffersPage() {
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const productsOnSale = allProducts.filter(p => p.salePrice && p.salePrice < p.price);
        setOfferProducts(productsOnSale);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">العروض الخاصة</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                لا تفوت أفضل الأسعار على منتجاتنا المختارة.
            </p>
        </div>
        <main>
          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                 <div key={i} className="flex-shrink-0">
                    <Skeleton className="h-96 w-[180px] mx-auto" />
                 </div>
              ))}
            </div>
          ) : offerProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {offerProducts.map(product => (
                <div key={product.id} className="flex justify-center">
                  <OfferProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
                <PercentCircle className="w-24 h-24 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold">لا توجد عروض حاليًا</h2>
                <p className="text-muted-foreground mt-2">تحقق مرة أخرى قريبًا للحصول على صفقات مذهلة!</p>
            </div>
          )}
        </main>
      </div>
  );
}

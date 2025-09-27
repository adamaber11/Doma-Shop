"use client";

import { notFound, useRouter } from 'next/navigation';
import { ProductDetailSheetContent } from '@/components/products/ProductDetailSheet';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { getProductById } from '@/services/product-service';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await getProductById(params.id);
      if (!fetchedProduct) {
        notFound();
      } else {
        setProduct(fetchedProduct);
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, [params.id]);

  const handleOpenChange = (open: boolean) => {
    if(!open) {
        // Use a slight delay to allow the sheet to close before navigating
        setTimeout(() => router.back(), 100);
    }
  }
  
  return (
    <Sheet open={true} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
          {loading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="aspect-square w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-20 w-20" />
                <Skeleton className="h-20 w-20" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : product ? (
            <ProductDetailSheetContent product={product} />
          ) : null}
      </SheetContent>
    </Sheet>
  );
}

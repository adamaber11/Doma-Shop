"use client";

import { notFound, useRouter } from 'next/navigation';
import { allProducts } from '@/lib/data';
import { ProductDetailSheetContent } from '@/components/products/ProductDetailSheet';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const product = allProducts.find(p => p.id === params.id);

  useEffect(() => {
    setIsClient(true);
    if (!product) {
      notFound();
    }
  }, [product]);

  if (!product) {
    return null;
  }
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        // Use a slight delay to allow the sheet to close before navigating
        setTimeout(() => router.back(), 100);
    }
  }
  
  if (!isClient) {
    return null;
  }

  return (
    <Sheet open={true} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
          <ProductDetailSheetContent product={product} />
      </SheetContent>
    </Sheet>
  );
}

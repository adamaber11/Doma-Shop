"use client";

import { notFound, useRouter } from 'next/navigation';
import { allProducts } from '@/lib/data';
import { ProductDetailSheetContent } from '@/components/products/ProductDetailSheet';
import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = allProducts.find(p => p.id === params.id);

  useEffect(() => {
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

  return (
    <Sheet open={true} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
          <ProductDetailSheetContent product={product} />
      </SheetContent>
    </Sheet>
  );
}

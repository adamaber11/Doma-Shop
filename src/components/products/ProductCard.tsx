"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductDetailSheetContent } from "./ProductDetailSheet";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImage = getPlaceholderImage(product.imageIds[0]);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={productImage.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                <p className="text-white text-sm mb-2">{product.description}</p>
                <p className="text-white font-bold text-lg">{formatCurrency(product.price)}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
          <ProductDetailSheetContent product={product} />
      </SheetContent>
    </Sheet>
  );
}

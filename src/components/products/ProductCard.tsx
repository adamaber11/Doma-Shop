"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductDetailSheetContent } from "./ProductDetailSheet";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImage = getPlaceholderImage(product.imageIds[0]);
  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent sheet from opening
    addToCart(product, 1);
  };
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // We check if the click target is the add to cart button or one of its children
    if ((e.target as HTMLElement).closest('.add-to-cart-btn')) {
        return;
    }
    setOpen(true);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Card onClick={handleCardClick} className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
             <SheetTrigger asChild>
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={productImage.imageHint}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </SheetTrigger>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <SheetTrigger asChild>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
          </SheetTrigger>
          <p className="text-muted-foreground text-sm">{formatCurrency(product.price)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full add-to-cart-btn">
            <ShoppingCart className="ml-2 h-4 w-4" />
            أضف إلى السلة
          </Button>
        </CardFooter>
      </Card>
      <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
          <ProductDetailSheetContent product={product} />
      </SheetContent>
    </Sheet>
  );
}

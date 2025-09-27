
"use client";

import Image from "next/image";
import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ProductDetailSheetContent } from "./ProductDetailSheet";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.variants?.[0]?.imageUrls?.[0] || getPlaceholderImage('product-1').imageUrl;
  
  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    e.preventDefault();
    if ((product.variants && product.variants.length > 1) || (product.sizes && product.sizes.length > 0)) {
        setOpen(true);
    } else {
        addToCart(product, 1, product.variants?.[0]?.color, product.sizes?.[0]);
    }
  };
  
  const hasSale = product.salePrice && product.salePrice < product.price;

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <>
      <div className="bg-white text-black h-full flex flex-col group overflow-hidden">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
            <div className="relative w-full aspect-[4/3] bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-sm font-normal line-clamp-2 mb-2 flex-grow">{product.name}</h3>
                
                {reviews.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("h-4 w-4", averageRating > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-600">({reviews.length})</span>
                    </div>
                )}

                <div className="mb-3">
                    {hasSale ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold">{formatCurrency(product.salePrice!)}</p>
                            <p className="text-xs text-gray-500 line-through">{formatCurrency(product.price)}</p>
                        </div>
                    ) : (
                        <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
                    )}
                </div>

                <Button onClick={handleAddToCart} variant="default" size="sm" className="w-full mt-auto text-xs h-8">
                    أضف إلى العربة
                </Button>
            </div>
        </Link>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
              <ProductDetailSheetContent product={product} />
          </SheetContent>
      </Sheet>
    </>
  );
}

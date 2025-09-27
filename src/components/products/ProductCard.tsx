
"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductDetailSheetContent } from "./ProductDetailSheet";
import { Badge } from "../ui/badge";

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

  return (
    <>
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 cursor-pointer">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
            <CardHeader className="p-0">
              <div className="relative aspect-square w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                     {hasSale && (
                        <Badge variant="destructive" className="absolute top-2 left-2">عرض</Badge>
                     )}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors flex-grow">{product.name}</h3>
                 <div className="flex items-center gap-2 mt-1">
                    {hasSale ? (
                        <>
                            <p className="text-lg font-semibold text-primary">{formatCurrency(product.salePrice!)}</p>
                            <p className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                        </>
                    ) : (
                        <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                    )}
                </div>
            </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="ml-2 h-4 w-4" />
            أضف إلى السلة
          </Button>
        </CardFooter>
      </Card>
      <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="w-full max-w-lg overflow-y-auto" side="right">
              <ProductDetailSheetContent product={product} />
          </SheetContent>
      </Sheet>
    </>
  );
}

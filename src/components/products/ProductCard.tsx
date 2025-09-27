
"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductDetailSheetContent } from "./ProductDetailSheet";
import { Button } from "../ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls[0] 
    : getPlaceholderImage('product-1').imageUrl;
  
  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    e.preventDefault();
    if ((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) {
        setOpen(true);
        toast({
            title: "التخصيص مطلوب",
            description: "الرجاء اختيار اللون والمقاس من صفحة تفاصيل المنتج.",
            variant: "default"
        });
    } else {
        addToCart(product, 1);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
        <SheetTrigger asChild>
            <Link href={`/products/${product.id}`} className="flex flex-col h-full" onClick={(e) => { e.preventDefault(); setOpen(true);}}>
                <CardHeader className="p-0">
                  <div className="relative aspect-square w-full">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Eye className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{formatCurrency(product.price)}</p>
                </CardContent>
            </Link>
        </SheetTrigger>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full">
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

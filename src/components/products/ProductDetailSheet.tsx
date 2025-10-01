
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailSheetContentProps {
    product: Product;
}

export function ProductDetailSheetContent({ product }: ProductDetailSheetContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.variants?.[0]?.color);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);

  const { addToCart } = useCart();
  const { toast } = useToast();

  const productImages = useMemo(() => {
    const variant = product.variants.find(v => v.color === selectedColor);
    return variant?.imageUrls || [getPlaceholderImage('product-1').imageUrl];
  }, [selectedColor, product.variants]);
  
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productImages]);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedColor) {
        toast({ title: "خطأ", description: "الرجاء اختيار لون.", variant: "destructive" });
        return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast({ title: "خطأ", description: "الرجاء اختيار مقاس.", variant: "destructive" });
        return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  return (
    <div className="py-4">
        <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl lg:text-3xl font-bold font-headline mb-2">{product.name}</SheetTitle>
            <SheetDescription className="text-3xl font-semibold text-primary">{formatCurrency(product.price)}</SheetDescription>
        </SheetHeader>
        <div className="aspect-square relative mb-4 rounded-lg overflow-hidden border">
            <Image
              src={productImages[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {productImages.map((imageUrl, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image src={imageUrl} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">اللون</h3>
                <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                        <button key={variant.color} onClick={() => setSelectedColor(variant.color)} className={cn("h-8 w-8 rounded-full border-2 transition-all", selectedColor === variant.color ? 'border-primary scale-110' : 'border-border')} style={{ backgroundColor: variant.color }} />
                    ))}
                </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">المقاس</h3>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                        <Button key={size} variant={selectedSize === size ? 'default' : 'outline'} onClick={() => setSelectedSize(size)}>
                            {size}
                        </Button>
                    ))}
                </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                readOnly
                className="w-16 h-10 text-center border-0 focus-visible:ring-0"
                min="1"
              />
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(q + 1, product.stock))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SheetClose asChild>
                <Button size="lg" onClick={handleAddToCart} className="flex-1" disabled={product.variants.length > 0 && !selectedColor}>
                أضف إلى السلة
                </Button>
            </SheetClose>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>{product.stock > 0 ? `${product.stock} متوفر في المخزون` : 'غير متوفر'}</span>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">تفاصيل المنتج</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {product.categoryId && <li>الفئة: {product.categoryId}</li>}
              <li>معرف المنتج: {product.id}</li>
            </ul>
          </div>
        
    </div>
  );
}

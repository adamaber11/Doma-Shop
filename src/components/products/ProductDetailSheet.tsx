"use client";

import { useState } from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

interface ProductDetailSheetContentProps {
    product: Product;
}

export function ProductDetailSheetContent({ product }: ProductDetailSheetContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  if (!product) {
    return null; // Or some fallback UI
  }

  const productImages = product.imageIds.map(id => getPlaceholderImage(id));

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="py-4">
        <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl lg:text-3xl font-bold font-headline mb-2">{product.name}</SheetTitle>
            <SheetDescription className="text-3xl font-semibold text-primary">{formatCurrency(product.price)}</SheetDescription>
        </SheetHeader>
        <div className="aspect-square relative mb-4 rounded-lg overflow-hidden border">
            <Image
              src={productImages[activeImageIndex].imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={productImages[activeImageIndex].imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 mb-4">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image src={image.imageUrl} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 h-10 text-center border-0 focus-visible:ring-0"
                min="1"
              />
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1">
              أضف إلى السلة
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>{product.stock > 0 ? `${product.stock} متوفر في المخزون` : 'غير متوفر'}</span>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">تفاصيل المنتج</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>الفئة: {product.categoryId}</li>
              <li>معرف المنتج: {product.id}</li>
            </ul>
          </div>
        
    </div>
  );
}

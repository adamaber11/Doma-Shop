
"use client";

import { notFound } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { getProductById } from '@/services/product-service';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { ProductRecommendations } from '@/components/products/ProductRecommendations';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await getProductById(params.id);
      if (!fetchedProduct) {
        notFound();
      } else {
        setProduct(fetchedProduct);
        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedColor(fetchedProduct.variants[0].color);
        }
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
            // No default selection for size to force user choice
        }
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, [params.id]);
  
  const productImages = useMemo(() => {
    if (!product) return [];
    const variant = product.variants.find(v => v.color === selectedColor);
    return variant?.imageUrls || [getPlaceholderImage('product-1').imageUrl];
  }, [selectedColor, product]);
  
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productImages]);


  const handleAddToCart = () => {
    if (!product) return;
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
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="flex gap-2 mt-4">
                        <Skeleton className="h-20 w-20 rounded-md" />
                        <Skeleton className="h-20 w-20 rounded-md" />
                        <Skeleton className="h-20 w-20 rounded-md" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
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
            <div className="flex gap-2 overflow-x-auto pb-2">
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
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-4">{formatCurrency(product.price)}</p>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
          
          <Separator className="my-4" />
            <div>
                <h3 className="text-lg font-semibold mb-2">تفاصيل المنتج</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.brand && <li><span className="font-semibold text-foreground">الماركة:</span> {product.brand}</li>}
                    {product.type && <li><span className="font-semibold text-foreground">النوع:</span> {product.type}</li>}
                    {product.material && <li><span className="font-semibold text-foreground">الخامة:</span> {product.material}</li>}
                    {product.madeIn && <li><span className="font-semibold text-foreground">بلد الصنع:</span> {product.madeIn}</li>}
                </ul>
            </div>
          <Separator className="my-4" />

          <div className="space-y-6 mb-6">
            {product.variants && product.variants.length > 0 && (
              <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">اللون</h3>
                  <div className="flex flex-wrap gap-2">
                      {product.variants.map(variant => (
                          <button key={variant.color} onClick={() => setSelectedColor(variant.color)} className={cn("h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center", selectedColor === variant.color ? 'border-primary' : 'border-border')} style={{ backgroundColor: variant.color }}>
                            {selectedColor === variant.color && <CheckCircle className="h-5 w-5 text-white mix-blend-difference" />}
                          </button>
                      ))}
                  </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
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
          </div>
          
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
              />
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1">
              أضف إلى السلة
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-600 mb-8">
            <CheckCircle className="h-5 w-5" />
            <span>{product.stock > 0 ? `${product.stock} متوفر في المخزون` : 'غير متوفر'}</span>
          </div>

          <Separator className="my-8" />

          <ProductRecommendations currentProductId={product.id} />

        </div>
      </div>
    </div>
  );
}

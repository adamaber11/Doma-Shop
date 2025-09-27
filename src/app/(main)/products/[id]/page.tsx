
"use client";

import { notFound, useRouter } from 'next/navigation';
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
import { Plus, Minus, CheckCircle, Star, ShoppingBag, LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { ProductRecommendations } from '@/components/products/ProductRecommendations';
import { ProductReviews } from '@/components/products/ProductReviews';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

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

  useEffect(() => {
    fetchProduct();
  }, [params.id]);
  
  const productImages = useMemo(() => {
    if (!product) return [];
    if (!product.variants || product.variants.length === 0) {
       return [getPlaceholderImage('product-1').imageUrl];
    }
    const variant = product.variants.find(v => v.color === selectedColor);
    return variant?.imageUrls || [getPlaceholderImage('product-1').imageUrl];
  }, [selectedColor, product]);
  
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productImages]);

  const handleAction = (buyNow: boolean = false) => {
    if (!product) return false;
    if (product.variants && product.variants.length > 0 && !selectedColor) {
        toast({ title: "خطأ", description: "الرجاء اختيار لون.", variant: "destructive" });
        return false;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast({ title: "خطأ", description: "الرجاء اختيار مقاس.", variant: "destructive" });
        return false;
    }
    addToCart(product, quantity, selectedColor, selectedSize);

    if (buyNow) {
        router.push('/checkout');
    }
    return true;
  };

  const handleAddToCart = () => {
    handleAction(false);
  }

  const handleBuyNow = () => {
    handleAction(true);
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المنتج إلى الحافظة.",
    });
  };
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                 <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-start">
                     <Skeleton className="aspect-square w-full rounded-lg order-1" />
                     <div className="flex flex-row md:flex-col gap-2 justify-center order-2 md:order-first">
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

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 items-start">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto justify-start md:justify-center order-2 md:order-first">
              {productImages.length > 1 && productImages.map((imageUrl, index) => (
                <button
                  key={index}
                  className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                      index === activeImageIndex ? 'border-primary' : 'border-transparent'
                  )}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image src={imageUrl} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
          </div>
          <div className="aspect-square relative rounded-lg overflow-hidden border order-1 md:order-last">
            <Image
              src={productImages[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>


        <div className="flex flex-col">
           <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
                <Button variant="ghost" size="icon" onClick={handleCopyLink} aria-label="نسخ رابط المنتج">
                    <LinkIcon className="h-6 w-6" />
                </Button>
            </div>
          
           <div className="flex items-center gap-4 mb-2">
              {hasSale ? (
                  <>
                      <p className="text-3xl font-semibold text-primary">{formatCurrency(product.salePrice!)}</p>
                      <p className="text-xl text-red-500 line-through">{formatCurrency(product.price)}</p>
                  </>
              ) : (
                  <p className="text-3xl font-semibold text-primary">{formatCurrency(product.price)}</p>
              )}
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={cn("h-5 w-5", averageRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({reviews.length} تقييمات)</span>
            </div>
          )}

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
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
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
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(q + 1, product.stock))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                 <Button size="lg" onClick={handleAddToCart} className="flex-1">
                    <ShoppingBag className="ml-2 h-5 w-5" />
                    أضف إلى السلة
                </Button>
                <Button size="lg" variant="secondary" onClick={handleBuyNow} className="flex-1">
                    اشتري الآن
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-600 mb-8">
            <CheckCircle className="h-5 w-5" />
            <span>{product.stock > 0 ? `${product.stock} متوفر في المخزون` : 'غير متوفر'}</span>
          </div>

        </div>
      </div>
      <Separator className="my-12" />
      <ProductReviews product={product} onReviewSubmit={fetchProduct} />
      <Separator className="my-12" />
      <ProductRecommendations currentProductId={product.id} />
    </div>
  );
}

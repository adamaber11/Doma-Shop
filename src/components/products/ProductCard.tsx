
"use client";

import Image from "next/image";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Star } from "lucide-react";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.variants?.[0]?.imageUrls?.[0] || getPlaceholderImage('product-1').imageUrl;
  
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <>
      <div className="bg-white text-black h-full flex flex-col max-w-[180px] mx-auto border border-transparent rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
            <div className="relative w-full aspect-[4/5] bg-white p-4">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
            <div className="p-2 pt-[5px] flex-grow flex flex-col bg-white">
                {hasSale && (
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5">خصم {discountPercentage}%</span>
                      <span className="text-red-600 text-[10px] font-bold">عرض لمدة محدودة</span>
                    </div>
                )}
                <h3 className="text-sm font-normal text-black line-clamp-2 mb-2 flex-grow hover:text-primary hover:underline h-[40px]">{product.name}</h3>
                
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
                            <p className="text-lg font-bold">{formatCurrency(product.salePrice!)}</p>
                            <p className="text-xs text-red-500 line-through">{formatCurrency(product.price)}</p>
                        </div>
                    ) : (
                        <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                    )}
                </div>
            </div>
        </Link>
      </div>
    </>
  );
}

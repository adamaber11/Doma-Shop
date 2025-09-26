"use client";

import { useEffect, useState } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/skeleton';

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app, browsing history would be tracked. Here we simulate it.
        const browsingHistory = allProducts.slice(0,5).map(p => p.id).join(',');
        
        const result = await getProductRecommendations({
          browsingHistory,
          cartItems: currentProductId, // Using current product as a proxy for cart item
        });

        if (result.recommendedProducts) {
          const recommended = result.recommendedProducts
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => !!p && p.id !== currentProductId)
            .slice(0, 4);
          setRecommendations(recommended);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        // Fallback to simple category-based recommendations
        const currentProduct = allProducts.find(p => p.id === currentProductId);
        if(currentProduct){
            const fallbackRecs = allProducts.filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProductId).slice(0,4);
            setRecommendations(fallbackRecs);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 font-headline">قد يعجبك ايضا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
             </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 font-headline">قد يعجبك ايضا</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recommendations.slice(0,2).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

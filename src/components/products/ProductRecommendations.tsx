
"use client";

import { useEffect, useState } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { getProducts } from '@/services/product-service';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/skeleton';

interface ProductRecommendationsProps {
  currentProductId: string;
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
    }
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

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
  }, [currentProductId, allProducts]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 font-headline">قد يعجبك ايضا</h2>
        <div className="flex flex-wrap justify-center -m-1">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="p-1">
                <Skeleton className="w-[180px] h-[240px]" />
                <Skeleton className="h-5 w-3/4 mt-2" />
                <Skeleton className="h-5 w-1/4 mt-1" />
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
      <div className="flex flex-wrap justify-center -m-1">
        {recommendations.map(product => (
          <div key={product.id} className="p-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

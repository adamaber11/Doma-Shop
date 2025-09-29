

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get('category') === categoryId) {
          params.delete('category');
          params.delete('subcategory');
      } else {
          params.set('category', categoryId);
          params.delete('subcategory');
      }
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  const clearFilters = () => {
      router.push(pathname);
  }

  return (
    <div className="relative w-full">
        {loading ? (
           <div className="flex items-center gap-8 overflow-x-auto pb-4">
              {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center flex-shrink-0 w-20">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
              ))}
            </div>
        ) : (
            <div>
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold font-headline">الفئات</h2>
                    <Button
                        variant={'ghost'}
                        onClick={clearFilters}
                        className={cn('text-sm', !selectedCategory && 'text-primary font-bold')}
                    >
                        عرض الكل
                    </Button>
                </div>
                <div className="flex items-start gap-6 overflow-x-auto pb-4">
                    {categories.map(category => (
                        <button 
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={cn(
                                'group flex flex-col items-center gap-2 text-center w-20 flex-shrink-0',
                            )}>
                                <div className={cn(
                                    "relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all group-hover:border-primary group-hover:scale-105",
                                    (selectedCategory === category.id) 
                                        ? 'border-primary' 
                                        : 'border-transparent'
                                )}>
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className={cn(
                                    "font-semibold text-xs text-card-foreground transition-colors",
                                    (selectedCategory === category.id) ? 'text-primary' : 'group-hover:text-primary'
                                )}>{category.name}</h3>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}

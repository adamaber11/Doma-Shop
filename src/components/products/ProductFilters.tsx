
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

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

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const selectedCategory = searchParams.get('category') || 'all';

  return (
    <div className="space-y-2">
        {loading ? (
        <div className='flex flex-col gap-2'>
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
            ))}
        </div>
        ) : (
            <div className="flex flex-col items-start gap-2">
                 <Button
                    variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                    onClick={() => handleCategoryChange('all')}
                    className="w-full justify-start"
                    >
                    الكل
                </Button>
                {categories.map(category => (
                     <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                        onClick={() => handleCategoryChange(category.id)}
                        className="w-full justify-start"
                        >
                        {category.name}
                    </Button>
                ))}
            </div>
        )}
    </div>
  );
}

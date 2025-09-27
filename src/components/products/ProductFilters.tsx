
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
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
    <div className="py-4">
        <h3 className="font-semibold mb-3 sr-only">الفئة</h3>
        {loading ? (
        <div className='flex items-center gap-2'>
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
            ))}
        </div>
        ) : (
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 space-x-reverse pb-2">
                     <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        onClick={() => handleCategoryChange('all')}
                        >
                        الكل
                    </Button>
                    {categories.map(category => (
                         <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            onClick={() => handleCategoryChange(category.id)}
                            >
                            {category.name}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )}
    </div>
  );
}

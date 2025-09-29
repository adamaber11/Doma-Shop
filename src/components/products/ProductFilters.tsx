

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
  const selectedSubCategory = searchParams.get('subcategory');

  const handleFilterClick = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // If clicking the same filter, remove it (and its children)
      if (params.get(name) === value) {
          params.delete(name);
          if (name === 'category') {
              params.delete('subcategory');
          }
          router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
          return;
      }
      
      params.set(name, value);
      if(name === 'category') {
          params.delete('subcategory');
      }
      router.push(pathname + '?' + params.toString());
  }

  return (
    <div className="relative w-full">
        {loading ? (
           <div className="flex items-center gap-8">
              {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center w-24">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
              ))}
            </div>
        ) : (
            <div>
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold font-headline">الفئات</h2>
                    <Button
                        variant={'ghost'}
                        onClick={() => router.push(pathname)}
                        className={cn('text-sm', !selectedCategory && !selectedSubCategory && 'text-primary font-bold')}
                    >
                        عرض الكل
                    </Button>
                </div>
                <div className="space-y-8">
                    {categories.map(category => (
                        <div key={category.id}>
                            <button 
                                onClick={() => handleFilterClick('category', category.id)}
                                className={cn(
                                'flex items-center gap-3 group w-full text-right',
                                (selectedCategory === category.id) && 'text-primary'
                            )}>
                                <div className={cn(
                                    "relative h-12 w-12 rounded-md overflow-hidden border-2 shrink-0 transition-all",
                                    (selectedCategory === category.id) 
                                        ? 'border-primary' 
                                        : 'border-transparent group-hover:border-primary/50'
                                )}>
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="font-semibold text-lg">{category.name}</h3>
                            </button>

                            {category.subcategories && category.subcategories.length > 0 && selectedCategory === category.id && (
                                <div className="mt-4 mr-8 pl-4 border-r-2 border-primary/20">
                                    <ul className='space-y-2'>
                                        {category.subcategories.map(sub => (
                                            <li key={sub.id}>
                                                <Button 
                                                    variant="ghost" 
                                                    className={cn("w-full justify-start", selectedSubCategory === sub.id ? "bg-accent text-accent-foreground" : "")}
                                                    onClick={() => handleFilterClick('subcategory', sub.id)}
                                                >
                                                    {sub.name}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}

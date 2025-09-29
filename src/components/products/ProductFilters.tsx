
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

  const activeCategoryId = searchParams.get('category');
  const activeSubcategoryId = searchParams.get('subcategory');

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
  
  const handleMainCategoryClick = (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategoryId === categoryId) {
          // If the same main category is clicked, clear all filters
          params.delete('category');
          params.delete('subcategory');
      } else {
          // If a new main category is clicked, set it and clear subcategory
          params.set('category', categoryId);
          params.delete('subcategory');
      }
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('subcategory', subcategoryId);
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  const clearFilters = () => {
      router.push(pathname);
  }

  const mainCategories = categories.filter(c => !c.parentId);
  const selectedMainCategory = mainCategories.find(c => c.id === activeCategoryId);

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
                        className={cn('text-sm', !activeCategoryId && 'text-primary font-bold')}
                    >
                        عرض الكل
                    </Button>
                </div>
                <div className="flex items-start gap-6 overflow-x-auto pb-4">
                    {mainCategories.map(category => (
                        <button 
                            key={category.id}
                            onClick={() => handleMainCategoryClick(category.id)}
                            className={cn(
                                'group flex flex-col items-center gap-2 text-center w-20 flex-shrink-0',
                            )}>
                                <div className={cn(
                                    "relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all group-hover:border-primary group-hover:scale-105",
                                    (activeCategoryId === category.id) 
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
                                    (activeCategoryId === category.id) ? 'text-primary' : 'group-hover:text-primary'
                                )}>{category.name}</h3>
                        </button>
                    ))}
                </div>

                {activeCategoryId && selectedMainCategory && selectedMainCategory.subcategories && selectedMainCategory.subcategories.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4 text-center">اختر فئة فرعية من {selectedMainCategory.name}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {selectedMainCategory.subcategories.map(sub => (
                                <Button
                                    key={sub.id}
                                    variant={activeSubcategoryId === sub.id ? 'default' : 'outline'}
                                    onClick={() => handleSubcategoryClick(sub.id)}
                                >
                                    {sub.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}

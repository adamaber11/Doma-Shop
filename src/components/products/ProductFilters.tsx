
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';


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
  
  const handleCategoryClick = (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategoryId === categoryId && !activeSubcategoryId) {
          // If the same main category is clicked (and no subcategory), clear all filters
          params.delete('category');
          params.delete('subcategory');
      } else {
          // If a new main category is clicked, set it and clear subcategory
          params.set('category', categoryId);
          params.delete('subcategory');
      }
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', categoryId);
      params.set('subcategory', subcategoryId);
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  const clearFilters = () => {
      router.push(pathname);
  }

  const mainCategories = categories.filter(c => !c.parentId);

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
                    {mainCategories.map(category => {
                        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                        const isCategoryActive = activeCategoryId === category.id;

                        if (hasSubcategories) {
                            return (
                                <DropdownMenu key={category.id}>
                                    <DropdownMenuTrigger asChild>
                                        <button 
                                            className={cn(
                                                'group flex flex-col items-center gap-2 text-center w-20 flex-shrink-0',
                                            )}>
                                                <div className={cn(
                                                    "relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all group-hover:border-primary group-hover:scale-105",
                                                    isCategoryActive ? 'border-primary' : 'border-transparent'
                                                )}>
                                                    <Image
                                                        src={category.imageUrl}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h3 className={cn(
                                                    "font-semibold text-xs text-card-foreground transition-colors flex items-center gap-1",
                                                    isCategoryActive ? 'text-primary' : 'group-hover:text-primary'
                                                )}>
                                                    {category.name}
                                                    <ChevronDown className="h-3 w-3" />
                                                </h3>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => handleCategoryClick(category.id)}>
                                            كل منتجات {category.name}
                                        </DropdownMenuItem>
                                        {category.subcategories?.map(sub => (
                                            <DropdownMenuItem key={sub.id} onSelect={() => handleSubcategoryClick(category.id, sub.id)}>
                                                {sub.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }

                        return (
                             <button 
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    'group flex flex-col items-center gap-2 text-center w-20 flex-shrink-0',
                                )}>
                                    <div className={cn(
                                        "relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all group-hover:border-primary group-hover:scale-105",
                                        isCategoryActive ? 'border-primary' : 'border-transparent'
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
                                        isCategoryActive ? 'text-primary' : 'group-hover:text-primary'
                                    )}>{category.name}</h3>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}
    </div>
  );
}

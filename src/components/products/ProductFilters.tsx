

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '../ui/separator';


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
  
  const handleFilterClick = (categoryId?: string, subcategoryId?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (categoryId) {
          params.set('category', categoryId);
      } else {
          params.delete('category');
      }

      if (subcategoryId) {
          params.set('subcategory', subcategoryId);
      } else {
          params.delete('subcategory');
      }
      
      router.push(pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  if (loading) {
     return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="w-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-headline">الفئات</h2>
        </div>
         <div className='flex flex-col items-start gap-1'>
            <Button
                variant={'link'}
                onClick={() => handleFilterClick()}
                className={cn('text-base h-auto p-1', !activeCategoryId ? 'text-primary font-bold' : 'text-foreground')}
            >
               الكل
            </Button>
            <Separator className="mb-2" />
        </div>
        <Accordion type="multiple" defaultValue={activeCategoryId ? [activeCategoryId] : []} className="w-full">
            {categories.map(category => (
                <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger 
                        onClick={() => handleFilterClick(category.id)}
                        className={cn("py-2 hover:no-underline font-semibold", activeCategoryId === category.id && !activeSubcategoryId && "text-primary")}
                    >
                        {category.name}
                    </AccordionTrigger>
                    {category.subcategories && category.subcategories.length > 0 && (
                        <AccordionContent>
                            <ul className="space-y-1 pr-4">
                                {category.subcategories.map(sub => (
                                     <li key={sub.id}>
                                         <button 
                                            onClick={() => handleFilterClick(category.id, sub.id)}
                                            className={cn(
                                                "w-full text-right text-muted-foreground hover:text-primary transition-colors text-sm",
                                                activeSubcategoryId === sub.id && 'text-primary font-medium'
                                            )}
                                        >
                                            {sub.name}
                                        </button>
                                     </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
}

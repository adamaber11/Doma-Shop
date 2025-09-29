

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from '../ui/button';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

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
      params.set(name, value);
      if(name === 'category') {
          params.delete('subcategory');
      }
      router.push(pathname + '?' + params.toString());
  }

  const handleCategoryClick = (category: Category) => {
    if (!category.subcategories || category.subcategories.length === 0) {
        handleFilterClick('category', category.id);
    } else {
        setOpenCollapsible(openCollapsible === category.id ? null : category.id);
    }
  }

  return (
    <div className="relative w-full">
        {loading ? (
           <div className="flex items-center gap-8">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24" />
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
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
                    {categories.map(category => (
                         <Collapsible key={category.id} open={openCollapsible === category.id} onOpenChange={() => handleCategoryClick(category)} className="col-span-1">
                            <div className='flex flex-col items-center gap-2 text-center'>
                                <CollapsibleTrigger asChild>
                                    <button className={cn(
                                        'flex flex-col items-center gap-2 group w-24',
                                        (selectedCategory === category.id || category.subcategories?.some(s => s.id === selectedSubCategory)) && 'text-primary'
                                    )}>
                                        <div className={cn(
                                            "relative h-20 w-20 rounded-full overflow-hidden border-2 transition-all",
                                            (selectedCategory === category.id || category.subcategories?.some(s => s.id === selectedSubCategory)) 
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
                                        <div className='flex items-center gap-1'>
                                            <h3 className="font-semibold text-sm">{category.name}</h3>
                                            {category.subcategories && category.subcategories.length > 0 && <ChevronsUpDown className="h-4 w-4 shrink-0" />}
                                        </div>
                                    </button>
                                </CollapsibleTrigger>
                            </div>

                            {category.subcategories && category.subcategories.length > 0 && (
                                <CollapsibleContent className="absolute z-20 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                                    <ul className='space-y-1'>
                                         <li>
                                            <Button
                                                variant="ghost"
                                                className={cn("w-full justify-start", selectedCategory === category.id && !selectedSubCategory ? "bg-accent" : "")}
                                                onClick={() => handleFilterClick('category', category.id)}
                                            >
                                                كل {category.name}
                                            </Button>
                                        </li>
                                        {category.subcategories.map(sub => (
                                            <li key={sub.id}>
                                                <Button 
                                                    variant="ghost" 
                                                    className={cn("w-full justify-start", selectedSubCategory === sub.id ? "bg-accent" : "")}
                                                    onClick={() => handleFilterClick('subcategory', sub.id)}
                                                >
                                                    {sub.name}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleContent>
                            )}
                         </Collapsible>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}

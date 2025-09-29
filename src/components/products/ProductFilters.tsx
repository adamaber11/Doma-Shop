
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

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString();
  };
  
  const selectedCategory = searchParams.get('category') || 'all';

  return (
    <div className="relative">
        {loading ? (
           <div className="flex space-x-4">
              {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-16 flex-shrink-0">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                  </div>
              ))}
            </div>
        ) : (
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 pb-4">
                    <Link 
                        href={pathname + '?' + createQueryString('category', 'all')} 
                        className={cn(
                            "group flex flex-col items-center gap-2 text-center w-16",
                        )}>
                    <div className={cn(
                        "relative h-16 w-16 rounded-full overflow-hidden border-2 flex items-center justify-center bg-muted transition-all",
                        selectedCategory === 'all' ? 'border-primary scale-105' : 'border-transparent group-hover:border-primary'
                    )}>
                            <span className='font-bold text-lg'>الكل</span>
                        </div>
                        <h3 className={cn(
                            "font-semibold text-xs text-card-foreground transition-colors",
                            selectedCategory === 'all' ? 'text-primary' : 'group-hover:text-primary'
                        )}>الكل</h3>
                    </Link>
                    {categories.map(category => (
                        <Link 
                            key={category.id} 
                            href={pathname + '?' + createQueryString('category', category.id)}
                            className="group flex flex-col items-center gap-2 text-center w-16"
                        >
                        <div className={cn(
                            "relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all",
                            selectedCategory === category.id ? 'border-primary scale-105' : 'border-transparent group-hover:border-primary'
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
                                selectedCategory === category.id ? 'text-primary' : 'group-hover:text-primary'
                            )}>{category.name}</h3>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )}
    </div>
  );
}

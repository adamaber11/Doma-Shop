

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

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
    params.set(name, value);
    if(name === 'category') {
        params.delete('subcategory');
    }
    return params.toString();
  };
  
  const selectedCategory = searchParams.get('category');
  const selectedSubCategory = searchParams.get('subcategory');

  const handleFilterClick = (name: string, value: string) => {
      router.push(pathname + '?' + createQueryString(name, value));
  }

  return (
    <div className="relative">
        {loading ? (
           <div className="flex items-center gap-4">
              {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28" />
              ))}
            </div>
        ) : (
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max items-center gap-2 pb-4">
                    <Button
                        variant={!selectedCategory ? 'default' : 'outline'}
                        onClick={() => router.push(pathname)}
                    >
                        الكل
                    </Button>
                    {categories.map(category => {
                        if (!category.subcategories || category.subcategories.length === 0) {
                            return (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                                    onClick={() => handleFilterClick('category', category.id)}
                                >
                                    {category.name}
                                </Button>
                            )
                        }

                        return (
                            <DropdownMenu key={category.id}>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                                        className="flex items-center gap-2"
                                    >
                                        {category.name}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => handleFilterClick('category', category.id)}>
                                        كل {category.name}
                                    </DropdownMenuItem>
                                    {category.subcategories.map(sub => (
                                        <DropdownMenuItem 
                                            key={sub.id} 
                                            onClick={() => handleFilterClick('subcategory', sub.id)}
                                            className={cn(selectedSubCategory === sub.id && 'bg-accent')}
                                        >
                                            {sub.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )}
    </div>
  );
}

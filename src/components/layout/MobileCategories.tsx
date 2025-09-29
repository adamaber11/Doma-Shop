
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SheetClose } from '../ui/sheet';

export function MobileCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await getCategories(true, false); // Fetch hierarchical categories
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="categories">
        <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
          الفئات
        </AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple" className="w-full pr-4">
            {categories.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="py-2 text-base hover:no-underline">
                   <SheetClose asChild>
                     <Link href={`/products?category=${category.id}`}>{category.name}</Link>
                   </SheetClose>
                </AccordionTrigger>
                {category.subcategories && category.subcategories.length > 0 && (
                  <AccordionContent>
                    <ul className="space-y-1 pr-4">
                      {category.subcategories.map(sub => (
                        <li key={sub.id}>
                           <SheetClose asChild>
                                <Link
                                    href={`/products?category=${category.id}&subcategory=${sub.id}`}
                                    className="block w-full text-right text-muted-foreground hover:text-primary transition-colors py-1"
                                >
                                    {sub.name}
                                </Link>
                           </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
             <SheetClose asChild>
                <Link href="/products" className="py-2 text-base font-medium flex justify-between items-center w-full">
                    جميع المنتجات
                </Link>
             </SheetClose>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

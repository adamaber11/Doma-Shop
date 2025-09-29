
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SheetClose } from '../ui/sheet';
import Image from 'next/image';

interface CategoryWithSubImages extends Category {
    subcategories?: (Category['subcategories'][number] & { imageUrl: string })[];
}

export function MobileCategories() {
  const [categories, setCategories] = useState<CategoryWithSubImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const allCategoriesList = await getCategories(true, true);
        const hierarchicalCategories = await getCategories(true, false);

        const categoryMap = new Map(allCategoriesList.map(cat => [cat.id, cat]));

        const processedCategories = hierarchicalCategories.map(mainCat => ({
            ...mainCat,
            subcategories: mainCat.subcategories?.map(sub => {
                const subCatData = categoryMap.get(sub.id);
                return {
                    ...sub,
                    imageUrl: subCatData?.imageUrl || "https://picsum.photos/seed/placeholder/40/40"
                };
            })
        }));
        
        setCategories(processedCategories);
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
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {categories.map(category => (
        <AccordionItem key={category.id} value={category.id}>
          <AccordionTrigger 
            className="py-2 text-lg font-medium hover:no-underline justify-between w-full"
          >
             <SheetClose asChild>
               <Link href={`/products?category=${category.id}`} className='flex-1 text-right'>{category.name}</Link>
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
                              className="flex items-center gap-3 w-full text-right text-muted-foreground hover:text-primary transition-colors py-2 rounded-md"
                          >
                              <Image src={sub.imageUrl} alt={sub.name} width={32} height={32} className="rounded-md object-cover" />
                              <span>{sub.name}</span>
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
          <Link href="/products" className="py-2 text-lg font-medium flex justify-between items-center w-full hover:underline">
              جميع المنتجات
          </Link>
       </SheetClose>
    </Accordion>
  );
}


"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { getCategories } from "@/services/product-service"
import type { Category as MainCategory, SubCategory } from "@/lib/types"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Skeleton } from "../ui/skeleton"

interface CategoryWithSubImages extends MainCategory {
    subcategories?: (SubCategory & { imageUrl: string })[];
}

export function CategoriesMenu() {
    const [categories, setCategories] = React.useState<CategoryWithSubImages[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAndProcessCategories = async () => {
            setLoading(true);
            try {
                // We need the raw list to find image URLs for subcategories
                const allCategoriesList = await getCategories(true, true);
                const hierarchicalCategories = await getCategories(true, false);

                const categoryMap = new Map(allCategoriesList.map(cat => [cat.id, cat]));

                const processedCategories = hierarchicalCategories.map(mainCat => ({
                    ...mainCat,
                    subcategories: mainCat.subcategories?.map(sub => {
                        const subCatData = categoryMap.get(sub.id);
                        return {
                            ...sub,
                            imageUrl: subCatData?.imageUrl || "https://picsum.photos/seed/placeholder/100/100"
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

        fetchAndProcessCategories();
    }, []);

    if (loading) {
        return <Skeleton className="h-9 w-24" />
    }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>الفئات</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {categories.map((category) => (
                <ListItem
                  key={category.name}
                  title={category.name}
                  href={`/products?category=${category.id}`}
                >
                  <div className="flex flex-col">
                    {category.subcategories && category.subcategories.length > 0 ? (
                        category.subcategories.map((sub) => (
                            <Link key={sub.id} href={`/products?category=${category.id}&subcategory=${sub.id}`} legacyBehavior passHref>
                                 <NavigationMenuLink className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                                    <Image src={sub.imageUrl} alt={sub.name} width={40} height={40} className="rounded-md object-cover" />
                                    <span className="text-sm font-medium">{sub.name}</span>
                                </NavigationMenuLink>
                            </Link>
                        ))
                    ) : (
                         <span className="text-sm text-muted-foreground p-2">لا توجد فئات فرعية</span>
                    )}
                  </div>
                </ListItem>
              ))}
                <ListItem href="/products" title="جميع المنتجات">
                    تصفح جميع المنتجات المتاحة في المتجر.
                </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={props.href || '#'} legacyBehavior>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </div>
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

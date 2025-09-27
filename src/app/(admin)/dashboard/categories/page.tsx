
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCategories(true); // Force refresh
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast({ title: "خطأ", description: "فشل في جلب الفئات.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الفئات</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة فئة
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>معرف الصورة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>معرف الصورة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const categoryImage = getPlaceholderImage(category.imageId);
                return (
                <TableRow key={category.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={category.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={categoryImage.imageUrl}
                            width="64"
                        />
                    </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.imageId}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/categories/edit/${category.id}`}>تعديل</Link></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      )}
       { !loading && categories.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على فئات</h2>
            <p className="text-muted-foreground mt-2">ابدأ بإضافة فئة جديدة.</p>
         </div>
        )}
    </div>
  );
}

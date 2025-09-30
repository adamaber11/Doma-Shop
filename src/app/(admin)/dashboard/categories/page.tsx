
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, deleteCategory, deleteSubCategory } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash2, Edit, ListTree } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  const handleDelete = async (categoryId: string, subCategoryId?: string) => {
    try {
      if (subCategoryId) {
        // The parentId is needed for some backend logic, but here we just need to delete the subcategory itself
        await deleteSubCategory(categoryId, subCategoryId);
        toast({ title: "نجاح", description: "تم حذف الفئة الفرعية بنجاح." });
      } else {
        await deleteCategory(categoryId);
        toast({ title: "نجاح", description: "تم حذف الفئة الرئيسية بنجاح." });
      }
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({ title: "خطأ", description: "فشل في حذف الفئة.", variant: "destructive" });
    }
  };

  if (loading) {
     return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
             <div className="border rounded-lg p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <Skeleton className="h-8 w-8" />
                        </div>
                        <div className="pl-16 space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
  }

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

       <div className="border rounded-lg">
          {categories.filter(c => !c.parentId).map(category => (
             <Collapsible key={category.id} defaultOpen className="border-b last:border-b-0">
                <div className="flex items-center p-4">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <ListTree className="h-4 w-4" />
                            <span className="sr-only">Toggle Subcategories</span>
                        </Button>
                    </CollapsibleTrigger>
                     <Image
                        alt={category.name}
                        className="aspect-square rounded-full object-cover mx-4"
                        height="48"
                        src={category.imageUrl}
                        width="48"
                    />
                    <div className="flex-1">
                        <p className="font-medium">{category.name}</p>
                        <Badge variant="secondary">فئة رئيسية</Badge>
                    </div>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuItem asChild><Link href={`/dashboard/categories/new?parentId=${category.id}`}>إضافة فئة فرعية</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={`/dashboard/categories/edit/${category.id}`}>تعديل</Link></DropdownMenuItem>
                           <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive focus:text-destructive">حذف</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                سيؤدي هذا إلى حذف الفئة الرئيسية وجميع الفئات الفرعية المرتبطة بها.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(category.id)}>متابعة</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                 <CollapsibleContent>
                    <div className="bg-muted/50 px-4 pb-4">
                         {categories.filter(sub => sub.parentId === category.id).length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">الصورة</TableHead>
                                        <TableHead>اسم الفئة الفرعية</TableHead>
                                        <TableHead className="text-left">الإجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.filter(sub => sub.parentId === category.id).map(subCategory => (
                                        <TableRow key={subCategory.id}>
                                            <TableCell>
                                                <Image alt={subCategory.name} className="aspect-square rounded-md object-cover" height="40" src={subCategory.imageUrl} width="40" />
                                            </TableCell>
                                            <TableCell className="font-medium">{subCategory.name}</TableCell>
                                            <TableCell className="text-left">
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem asChild><Link href={`/dashboard/categories/edit/${subCategory.id}`}>تعديل</Link></DropdownMenuItem>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive">حذف</DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                     <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                هذا الإجراء سيحذف الفئة الفرعية بشكل دائم.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(category.id, subCategory.id)}>حذف</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                <p>لا توجد فئات فرعية. <Link href={`/dashboard/categories/new?parentId=${category.id}`} className="text-primary underline">أضف واحدة</Link>.</p>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
             </Collapsible>
          ))}
       </div>

       { !loading && categories.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على فئات</h2>
            <p className="text-muted-foreground mt-2">ابدأ بإضافة فئة جديدة.</p>
         </div>
        )}
    </div>
  );
}
    

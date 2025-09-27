
"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateCategory, getCategoryById } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categorySchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم الفئة حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
});

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const categoryId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedCategory = await getCategoryById(categoryId);

        if (fetchedCategory) {
          setCategory(fetchedCategory);
          form.reset(fetchedCategory);
        } else {
            toast({ title: "خطأ", description: "لم يتم العثور على الفئة.", variant: "destructive" });
            router.push('/dashboard/categories');
        }
      } catch (error) {
        console.error("Failed to fetch category", error);
        toast({ title: "خطأ", description: "فشل في جلب بيانات الفئة.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
        fetchData();
    }
  }, [categoryId, form, router, toast]);

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      await updateCategory(categoryId, values);
      toast({ title: "نجاح", description: "تم تحديث الفئة بنجاح." });
      router.push('/dashboard/categories');
    } catch (error) {
      console.error("Failed to update category", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الفئة.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-4 w-64 mt-2' />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
            </CardContent>
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
  }

  if (!category) {
      return null;
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>تعديل الفئة</CardTitle>
                            <CardDescription>تحديث تفاصيل الفئة أدناه.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/categories">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى الفئات
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>اسم الفئة</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رابط صورة الفئة</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                         <FormMessage />
                    </FormItem>
                    )} />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري التحديث...' : 'حفظ التغييرات'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}


"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateCategory, getCategoryById, getCategories } from '@/services/product-service';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categorySchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم الفئة حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  type: z.enum(['main', 'sub']),
  parentId: z.string().optional(),
}).refine(data => {
    if (data.type === 'sub' && !data.parentId) {
        return false;
    }
    return true;
}, {
    message: "الرجاء اختيار فئة رئيسية",
    path: ['parentId'],
});

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const categoryId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });
  
  const categoryType = form.watch('type');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCategory, allCategories] = await Promise.all([
            getCategoryById(categoryId),
            getCategories()
        ]);
        
        setMainCategories(allCategories.filter(c => !c.parentId && c.id !== categoryId));

        if (fetchedCategory) {
          form.reset({
              name: fetchedCategory.name,
              imageUrl: fetchedCategory.imageUrl,
              type: fetchedCategory.parentId ? 'sub' : 'main',
              parentId: fetchedCategory.parentId,
          });
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
       const categoryUpdate = {
          name: values.name,
          imageUrl: values.imageUrl,
          parentId: values.type === 'sub' ? values.parentId : undefined,
      };
      await updateCategory(categoryId, categoryUpdate);
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
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </CardContent>
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
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
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>نوع الفئة</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        if (value === 'main') {
                                            form.setValue('parentId', undefined);
                                        }
                                    }}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="main" />
                                        </FormControl>
                                        <FormLabel className="font-normal">فئة رئيسية</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="sub" />
                                        </FormControl>
                                        <FormLabel className="font-normal">فئة فرعية</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                     {categoryType === 'sub' && (
                         <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الفئة الرئيسية</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر فئة رئيسية" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mainCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}


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
    

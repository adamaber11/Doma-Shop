
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCategory, getCategories } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import type { Category } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم الفئة حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  type: z.enum(['main', 'sub'], { required_error: 'الرجاء تحديد نوع الفئة' }),
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

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get('parentId');
  const { toast } = useToast();
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      type: parentIdParam ? 'sub' : 'main',
      parentId: parentIdParam || undefined,
    }
  });

  const categoryType = form.watch('type');

  useEffect(() => {
      const fetchMainCategories = async () => {
          const allCategories = await getCategories();
          setMainCategories(allCategories.filter(c => !c.parentId));
      }
      fetchMainCategories();
  }, []);

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      const categoryData = {
          name: values.name,
          imageUrl: values.imageUrl,
          ...(values.type === 'sub' && { parentId: values.parentId })
      };
      await addCategory(categoryData);
      toast({ title: "نجاح", description: "تمت إضافة الفئة بنجاح." });
      router.push('/dashboard/categories');
    } catch (error) {
      console.error("Failed to add category", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الفئة.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>إضافة فئة جديدة</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة فئة جديدة.</CardDescription>
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
                        <FormControl><Input placeholder="مثال: إلكترونيات" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رابط صورة الفئة</FormLabel>
                        <FormControl><Input placeholder="https://example.com/category-image.png" {...field} /></FormControl>
                         <FormMessage />
                    </FormItem>
                    )} />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة فئة'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

    
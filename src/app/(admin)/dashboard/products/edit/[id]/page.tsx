
"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProduct, getProductById, getCategories } from '@/services/product-service';
import type { Category, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const productSchema = z.object({
  name: z.string().min(3, "يجب أن يكون اسم المنتج 3 أحرف على الأقل"),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
  price: z.coerce.number().min(0.01, "السعر مطلوب"),
  categoryId: z.string({ required_error: "الفئة مطلوبة" }),
  stock: z.coerce.number().min(0, "المخزون مطلوب"),
  imageUrls: z.array(z.object({ value: z.string().url("يجب أن يكون رابطًا صالحًا") })).min(1, "رابط صورة واحد على الأقل مطلوب"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const productId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedProduct] = await Promise.all([
          getCategories(),
          getProductById(productId)
        ]);
        setCategories(fetchedCategories);

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          const defaultValues = {
            ...fetchedProduct,
            imageUrls: fetchedProduct.imageUrls.map(url => ({ value: url }))
          };
          form.reset(defaultValues);
        } else {
            toast({ title: "خطأ", description: "لم يتم العثور على المنتج.", variant: "destructive" });
            router.push('/dashboard/products');
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({ title: "خطأ", description: "فشل في جلب البيانات.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
        fetchData();
    }
  }, [productId, form, router, toast]);

  const onSubmit = async (values: ProductFormValues) => {
     const productData = {
      ...values,
      imageUrls: values.imageUrls.map(url => url.value)
    };
    try {
      await updateProduct(productId, productData);
      toast({ title: "نجاح", description: "تم تحديث المنتج بنجاح." });
      router.push('/dashboard/products');
    } catch (error) {
      console.error("Failed to update product", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المنتج.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-4 w-64 mt-2' />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-24 w-full' /></div>
                 <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-40 w-full' /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                </div>
                 <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
            </CardContent>
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
  }

  if (!product) {
      return null;
  }

  return (
    <Card className="max-w-4xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>تعديل المنتج</CardTitle>
                            <CardDescription>تحديث تفاصيل المنتج أدناه.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/products">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى المنتجات
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>اسم المنتج</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>الوصف</FormLabel>
                        <FormControl><Textarea {...field} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    
                    <div>
                      <FormLabel>روابط صور المنتج</FormLabel>
                      <div className="space-y-4 mt-2">
                        {fields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={form.control}
                            name={`imageUrls.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input placeholder="https://example.com/image.png" {...field} />
                                  </FormControl>
                                  {fields.length > 1 && (
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ value: "" })}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          إضافة رابط صورة
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>السعر</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                        <FormField control={form.control} name="stock" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الكمية في المخزون</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>الفئة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر فئة" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
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

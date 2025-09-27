
"use client";

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addProduct, getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

const productSchema = z.object({
  name: z.string().min(3, "يجب أن يكون اسم المنتج 3 أحرف على الأقل"),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
  price: z.coerce.number().min(0.01, "السعر مطلوب"),
  categoryId: z.string({ required_error: "الفئة مطلوبة" }),
  stock: z.coerce.number().min(0, "المخزون مطلوب"),
  imageUrls: z.array(z.object({ value: z.string().url("يجب أن يكون رابطًا صالحًا") })).min(1, "رابط صورة واحد على الأقل مطلوب"),
  isFeatured: z.boolean().default(false),
  isBestOffer: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrls: [{ value: "" }],
      isFeatured: false,
      isBestOffer: false,
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  const onSubmit = async (values: ProductFormValues) => {
    const productData = {
      ...values,
      imageUrls: values.imageUrls.map(url => url.value)
    };
    try {
      await addProduct(productData);
      toast({ title: "نجاح", description: "تمت إضافة المنتج بنجاح." });
      router.push('/dashboard/products');
    } catch (error) {
      console.error("Failed to add product", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المنتج.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>إضافة منتج جديد</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة منتج جديد.</CardDescription>
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
                        <FormControl><Input placeholder="مثال: قميص قطني" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>الوصف</FormLabel>
                        <FormControl><Textarea placeholder="وصف تفصيلي للمنتج..." {...field} rows={5} /></FormControl>
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
                        {loadingCategories ? <Skeleton className='h-10 w-full' /> : (
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
                        )}
                        <FormMessage />
                    </FormItem>
                    )} />

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>منتج مميز</FormLabel>
                                        <FormDescription>
                                            سيظهر هذا المنتج في قسم "المنتجات المميزة" في الصفحة الرئيسية.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isBestOffer"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>أفضل العروض</FormLabel>
                                        <FormDescription>
                                            سيظهر هذا المنتج في قسم "أفضل العروض" في الصفحة الرئيسية.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة منتج'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

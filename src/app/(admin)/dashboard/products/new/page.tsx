

"use client";

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addProduct, getCategories } from '@/services/product-service';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const variantSchema = z.object({
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "يجب أن يكون اللون صالحًا (hex code)"),
  imageUrls: z.array(z.object({ value: z.string().url("يجب أن يكون رابطًا صالحًا") })).min(1, "رابط صورة واحد على الأقل مطلوب للمتغير"),
});

const productSchema = z.object({
  name: z.string().min(3, "يجب أن يكون اسم المنتج 3 أحرف على الأقل"),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
  price: z.coerce.number().min(0.01, "السعر مطلوب"),
  salePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().min(0, "المخزون مطلوب"),
  variants: z.array(variantSchema).min(1, "متغير واحد على الأقل مطلوب (لون وصور)"),
  isFeatured: z.boolean().default(false),
  isBestOffer: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  sizes: z.array(z.object({ value: z.string().min(1, "المقاس مطلوب") })).optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  material: z.string().optional(),
  madeIn: z.string().optional(),
  categoryId: z.string({ required_error: "الفئة الرئيسية مطلوبة" }),
  subcategoryId: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      salePrice: null,
      stock: 0,
      variants: [{ color: "#000000", imageUrls: [{ value: "" }] }],
      isFeatured: false,
      isBestOffer: false,
      isBestSeller: false,
      sizes: [],
      brand: "",
      type: "",
      material: "",
      madeIn: "",
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control: form.control, name: "sizes" });

  const selectedCategoryId = form.watch('categoryId');

  useEffect(() => {
    const fetchCats = async () => {
        setLoadingCategories(true);
        try {
            const allCats = await getCategories(true, true);
            const mainCats = allCats.filter(c => !c.parentId);
            setCategories(mainCats);

            if (selectedCategoryId) {
                const subs = allCats.filter(c => c.parentId === selectedCategoryId);
                setSubcategories(subs);
            } else {
                setSubcategories([]);
            }
        } catch (error) {
             console.error("Failed to fetch categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };
    fetchCats();
}, [selectedCategoryId]);


  const onSubmit = async (values: ProductFormValues) => {
    const productData = {
        ...values,
        salePrice: values.salePrice || null,
        variants: values.variants.map(variant => ({
            ...variant,
            imageUrls: variant.imageUrls.map(url => url.value)
        })),
        sizes: values.sizes?.map(size => size.value)
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>الفئة الرئيسية</FormLabel>
                                {loadingCategories ? <Skeleton className="h-10 w-full" /> : (
                                    <Select onValueChange={(value) => { field.onChange(value); form.setValue('subcategoryId', undefined); }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر فئة رئيسية" />
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
                        {selectedCategoryId && subcategories.length > 0 && (
                            <FormField control={form.control} name="subcategoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الفئة الفرعية</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر فئة فرعية" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subcategories.map(sub => (
                                                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                    </div>
                    
                    <div className='space-y-6'>
                         <FormLabel>متغيرات المنتج (الألوان والصور)</FormLabel>
                        {variantFields.map((variantField, variantIndex) => (
                           <Card key={variantField.id} className="p-4 relative">
                             <div className="space-y-4">
                               <FormField
                                  control={form.control}
                                  name={`variants.${variantIndex}.color`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>لون المتغير</FormLabel>
                                       <FormControl>
                                         <div className='relative'>
                                            <Input placeholder="#FFFFFF" className='pl-10' {...field} />
                                            <Input type="color" className='absolute top-1/2 left-2 -translate-y-1/2 h-6 w-6 p-0 border-none' value={field.value || '#000000'} onChange={(e) => field.onChange(e.target.value)} />
                                         </div>
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <ImageUrlsFieldArray variantIndex={variantIndex} control={form.control} />
                              </div>
                               {variantFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7"
                                  onClick={() => removeVariant(variantIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                           </Card>
                        ))}
                         <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendVariant({ color: '#000000', imageUrls: [{ value: '' }] })}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          إضافة متغير لون
                        </Button>
                    </div>

                    <div>
                      <FormLabel>مقاسات المنتج (اختياري)</FormLabel>
                      <div className="space-y-4 mt-2">
                        {sizeFields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={form.control}
                            name={`sizes.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input placeholder="M" {...field} />
                                  </FormControl>
                                  <Button type="button" variant="destructive" size="icon" onClick={() => removeSize(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendSize({ value: "" })}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          إضافة مقاس
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>السعر الأصلي</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                        <FormField control={form.control} name="salePrice" render={({ field }) => (
                        <FormItem>
                            <FormLabel>سعر العرض (اختياري)</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="stock" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الكمية في المخزون</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="brand" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الماركة (اختياري)</FormLabel>
                            <FormControl><Input placeholder="مثال: Nike" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                        <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>النوع (اختياري)</FormLabel>
                            <FormControl><Input placeholder="مثال: حقيبة حريمي" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="material" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الخامة (اختياري)</FormLabel>
                            <FormControl><Input placeholder="مثال: خرز" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                        <FormField control={form.control} name="madeIn" render={({ field }) => (
                        <FormItem>
                            <FormLabel>بلد الصنع (اختياري)</FormLabel>
                            <FormControl><Input placeholder="مثال: مصر" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </div>

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
                         <FormField
                            control={form.control}
                            name="isBestSeller"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>منتج الأكثر مبيعًا</FormLabel>
                                        <FormDescription>
                                           سيظهر هذا المنتج في قسم "الأكثر مبيعًا" في صفحة المنتجات.
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

function ImageUrlsFieldArray({ variantIndex, control }: { variantIndex: number; control: Control<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.imageUrls`,
  });

  return (
    <div className="space-y-2">
      <FormLabel>روابط صور المتغير</FormLabel>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`variants.${variantIndex}.imageUrls.${index}.value`}
          render={({ field: formField }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...formField} />
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
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        إضافة رابط صورة
      </Button>
    </div>
  );
}

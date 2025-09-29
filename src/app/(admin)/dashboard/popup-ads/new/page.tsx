

"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addPopupAd } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const adSchema = z.object({
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  linkUrl: z.string().url("يجب أن يكون رابط الانتقال صالحًا"),
  isActive: z.boolean().default(true),
  displayPages: z.array(z.string()).min(1, "الرجاء اختيار صفحة واحدة على الأقل"),
  duration: z.coerce.number().min(0, "المدة يجب أن تكون رقمًا موجبًا").default(0),
});

export default function NewPopupAdPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adSchema>>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      imageUrl: "",
      linkUrl: "",
      isActive: true,
      displayPages: ['all'],
      duration: 0,
    }
  });

  const onSubmit = async (values: z.infer<typeof adSchema>) => {
    try {
      await addPopupAd(values);
      toast({ title: "نجاح", description: "تمت إضافة الإعلان المنبثق بنجاح." });
      router.push('/dashboard/popup-ads');
    } catch (error) {
      console.error("Failed to add ad", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الإعلان.",
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
                            <CardTitle>إضافة إعلان منبثق جديد</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة إعلان منبثق جديد.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/popup-ads">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى الإعلانات المنبثقة
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة الإعلان</FormLabel>
                            <FormControl><Input placeholder="https://example.com/ad-image.png" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="linkUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط الانتقال عند النقر</FormLabel>
                            <FormControl><Input placeholder="https://example.com/product/123" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField
                        control={form.control}
                        name="displayPages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>عرض في الصفحات</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value === 'all' ? ['all'] : [value])} defaultValue={field.value[0]}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر مكان ظهور الإعلان" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="all">كل الصفحات</SelectItem>
                                        <SelectItem value="home">الصفحة الرئيسية فقط</SelectItem>
                                        <SelectItem value="products">صفحة المنتجات فقط</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>اختر أين يجب أن يظهر هذا الإعلان المنبثق.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>مدة العرض (بالثواني)</FormLabel>
                                <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                                 <FormDescription>
                                    كم ثانية يجب أن يظهر الإعلان قبل ظهور زر الإغلاق؟ (0 لإظهاره فورًا).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>إعلان نشط</FormLabel>
                                    <FormDescription>
                                        هل يجب عرض هذا الإعلان للمستخدمين؟
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة إعلان'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

    
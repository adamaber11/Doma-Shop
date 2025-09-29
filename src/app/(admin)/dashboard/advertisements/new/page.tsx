

"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addAd } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const adSchema = z.object({
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  linkUrl: z.string().url("يجب أن يكون رابط الانتقال صالحًا"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function NewAdPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adSchema>>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      imageUrl: "",
      linkUrl: "",
      description: "",
      isActive: true,
    }
  });

  const onSubmit = async (values: z.infer<typeof adSchema>) => {
    try {
      await addAd(values);
      toast({ title: "نجاح", description: "تمت إضافة البنر بنجاح." });
      router.push('/dashboard/advertisements');
    } catch (error) {
      console.error("Failed to add ad", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة البنر.",
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
                            <CardTitle>إضافة بنر جديد</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة بنر جديد للصفحة الرئيسية.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/advertisements">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى البنرات
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة البنر</FormLabel>
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
                    
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الوصف (اختياري)</FormLabel>
                            <FormControl><Textarea placeholder="وصف قصير يظهر عند مرور الماوس..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>بنر نشط</FormLabel>
                                    <FormDescription>
                                        هل يجب عرض هذا البنر للمستخدمين؟
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة بنر'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}


"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateBrand, getBrandById } from '@/services/product-service';
import type { Brand } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const brandSchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم العلامة التجارية حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
});

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const brandId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
  });
  
  const imageUrlValue = form.watch('imageUrl');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedBrand = await getBrandById(brandId);
        if (fetchedBrand) {
          form.reset(fetchedBrand);
        } else {
          toast({ title: "خطأ", description: "لم يتم العثور على العلامة التجارية.", variant: "destructive" });
          router.push('/dashboard/brands');
        }
      } catch (error) {
        console.error("Failed to fetch brand", error);
        toast({ title: "خطأ", description: "فشل في جلب بيانات العلامة التجارية.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (brandId) {
        fetchData();
    }
  }, [brandId, form, router, toast]);

  const onSubmit = async (values: z.infer<typeof brandSchema>) => {
    try {
      await updateBrand(brandId, values);
      toast({ title: "نجاح", description: "تم تحديث العلامة التجارية بنجاح." });
      router.push('/dashboard/brands');
    } catch (error) {
      console.error("Failed to update brand", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث العلامة التجارية.",
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
                <div className="space-y-2"><Skeleton className='h-24 w-24 rounded-full' /></div>
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
                            <CardTitle>تعديل العلامة التجارية</CardTitle>
                            <CardDescription>تحديث تفاصيل العلامة التجارية أدناه.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/brands">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى العلامات التجارية
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>اسم العلامة التجارية</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة العلامة التجارية</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    {imageUrlValue && (
                        <div>
                            <FormLabel>معاينة الصورة</FormLabel>
                            <div className="mt-2 relative h-24 w-24 rounded-full overflow-hidden border">
                                <Image src={imageUrlValue} alt="معاينة الشعار" fill className="object-contain p-2"/>
                            </div>
                        </div>
                    )}
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

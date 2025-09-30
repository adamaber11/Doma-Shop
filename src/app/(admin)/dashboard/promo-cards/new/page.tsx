
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addPromoCard } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const promoCardSchema = z.object({
  title: z.string().min(3, "العنوان قصير جدًا"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  linkUrl: z.string().url("يجب أن يكون رابط الانتقال صالحًا"),
  linkText: z.string().min(2, "نص الرابط قصير جدًا"),
});

export default function NewPromoCardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof promoCardSchema>>({
    resolver: zodResolver(promoCardSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      linkUrl: "",
      linkText: "تسوق الآن",
    }
  });

  const imageUrlValue = form.watch('imageUrl');

  const onSubmit = async (values: z.infer<typeof promoCardSchema>) => {
    try {
      await addPromoCard({ ...values, isActive: true });
      toast({ title: "نجاح", description: "تمت إضافة البطاقة الترويجية بنجاح." });
      router.push('/dashboard/promo-cards');
    } catch (error) {
      console.error("Failed to add card", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة البطاقة.",
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
                            <CardTitle>إضافة بطاقة ترويجية جديدة</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة بطاقة جديدة.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/promo-cards">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى البطاقات
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl><Input placeholder="مثال: عروض اليوم" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة البطاقة</FormLabel>
                            <FormControl><Input placeholder="https://example.com/promo-image.png" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    {imageUrlValue && (
                        <div>
                            <FormLabel>معاينة الصورة</FormLabel>
                            <div className="mt-2 relative aspect-square w-full max-w-sm rounded-md overflow-hidden border">
                                <Image src={imageUrlValue} alt="معاينة البطاقة" fill className="object-cover"/>
                            </div>
                        </div>
                    )}

                    <FormField control={form.control} name="linkUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط الانتقال عند النقر</FormLabel>
                            <FormControl><Input placeholder="https://example.com/offers" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="linkText" render={({ field }) => (
                        <FormItem>
                            <FormLabel>نص الرابط</FormLabel>
                            <FormControl><Input placeholder="تسوق الآن" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة بطاقة'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

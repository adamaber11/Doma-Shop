
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addBrand } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const brandSchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم العلامة التجارية حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
});

export default function NewBrandPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  const imageUrlValue = form.watch('imageUrl');

  const onSubmit = async (values: z.infer<typeof brandSchema>) => {
    try {
      await addBrand(values);
      toast({ title: "نجاح", description: "تمت إضافة العلامة التجارية بنجاح." });
      router.push('/dashboard/brands');
    } catch (error) {
      console.error("Failed to add brand", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة العلامة التجارية.",
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
                            <CardTitle>إضافة علامة تجارية جديدة</CardTitle>
                            <CardDescription>املأ التفاصيل أدناه لإضافة علامة تجارية جديدة.</CardDescription>
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
                            <FormControl><Input placeholder="مثال: Nike" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة العلامة التجارية</FormLabel>
                            <FormControl><Input placeholder="https://example.com/brand-logo.png" {...field} /></FormControl>
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
                        {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة علامة تجارية'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

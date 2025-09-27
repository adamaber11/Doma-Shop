
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCategory } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم الفئة حرفين على الأقل"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
});

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      await addCategory(values);
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

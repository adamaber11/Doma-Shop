"use client";

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const signupSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن لا تقل كلمة المرور عن 8 أحرف"),
});

export default function SignupPage() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    console.log("Signup submitted:", values);
    // Handle signup logic here
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>إنشاء حساب</CardTitle>
        <CardDescription>انضم إلى دوما لبدء التسوق.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl><Input placeholder="جون دو" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full">إنشاء حساب</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p>لديك حساب بالفعل؟&nbsp;<Link href="/login" className="text-primary hover:underline relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">تسجيل الدخول</Link></p>
      </CardFooter>
    </Card>
  );
}

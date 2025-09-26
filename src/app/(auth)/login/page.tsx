"use client";

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Login submitted:", values);
    // Handle login logic here
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>أهلاً بعودتك!</CardTitle>
        <CardDescription>أدخل بياناتك للوصول إلى حسابك.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full">تسجيل الدخول</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p>ليس لديك حساب؟&nbsp;<Link href="/signup" className="text-primary hover:underline relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">إنشاء حساب</Link></p>
      </CardFooter>
    </Card>
  );
}

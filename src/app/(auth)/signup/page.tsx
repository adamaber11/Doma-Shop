"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";


const signupSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن لا تقل كلمة المرور عن 8 أحرف"),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "تم إنشاء الحساب بنجاح!" });
      router.push('/');
    } catch (error) {
      console.error("Signup error", error);
      toast({
        title: "حدث خطأ",
        description: "هذا البريد الإلكتروني مستخدم بالفعل.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const auth = getAuth();
        await signInWithPopup(auth, new GoogleAuthProvider());
        toast({ title: "تم تسجيل الدخول بنجاح!" });
        router.push('/');
    } catch (error) {
        console.error("Social login error", error);
        toast({
            title: "حدث خطأ",
            description: "لم نتمكن من تسجيل دخولك باستخدام جوجل.",
            variant: "destructive",
        });
    }
  };

  if (loading) {
     return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-5 w-full" />
            </CardFooter>
        </Card>
    )
  }

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
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              أو استمر مع
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" onClick={handleGoogleLogin}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p>لديك حساب بالفعل؟&nbsp;<Link href="/login" className="text-primary hover:underline relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">تسجيل الدخول</Link></p>
      </CardFooter>
    </Card>
  );
}


"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { updateProfile } from 'firebase/auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const profileSchema = z.object({
  name: z.string().min(2, "الاسم قصير جدًا"),
  email: z.string().email().optional(),
});

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, loading, router, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: values.name });
      toast({ title: "نجاح", description: "تم تحديث ملفك الشخصي." });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملف الشخصي.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || !user) {
      return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className='space-y-2'>
                           <Skeleton className='h-6 w-32' />
                           <Skeleton className='h-4 w-48' />
                        </div>
                    </div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                </CardContent>
                 <CardFooter>
                    <Skeleton className='h-10 w-32' />
                </CardFooter>
            </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>ملفي الشخصي</CardTitle>
                    <CardDescription>إدارة معلومات حسابك.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{user.displayName}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>الاسم</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl><Input disabled {...field} /></FormControl>
                            <FormDescription>لا يمكن تغيير البريد الإلكتروني.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}

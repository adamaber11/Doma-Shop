
"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSocialMediaSettings } from "@/services/settings-service";
import { addSubscriber } from "@/services/product-service";
import type { SocialMediaSettings } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ClientOnly } from "./ClientOnly";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.52 7.04C12.52 6.47 12.99 6 13.56 6C14.13 6 14.6 6.47 14.6 7.04C14.6 7.61 14.13 8.08 13.56 8.08C12.99 8.08 12.52 7.61 12.52 7.04Z" />
        <path d="M16.92 4.45V13.84C16.92 16.48 14.82 18.58 12.18 18.58C9.54 18.58 7.44 16.48 7.44 13.84V4.45" />
        <path d="M12.18 18.58C12.18 18.58 12.22 18.58 12.26 18.58C13.88 18.58 15.22 17.5 15.65 16.05" />
        <path d="M7.44 4.45C7.44 4.45 7.42 4.45 7.4 4.45C6.06 4.45 5 5.51 5 6.85C5 8.19 6.06 9.25 7.4 9.25C7.42 9.25 7.44 9.25 7.44 9.25" />
    </svg>
)

const newsletterSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
});

export function Footer() {
  const [socialSettings, setSocialSettings] = useState<SocialMediaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await getSocialMediaSettings();
        setSocialSettings(settings);
      } catch (error) {
        console.error("Failed to fetch social media settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const onNewsletterSubmit = async (values: z.infer<typeof newsletterSchema>) => {
    try {
      const result = await addSubscriber(values.email);
      if ('error' in result) {
        toast({
            title: "خطأ",
            description: "هذا البريد الإلكتروني مشترك بالفعل.",
            variant: "destructive",
        });
      } else {
         toast({
            title: "تم الاشتراك بنجاح!",
            description: "شكرًا لانضمامك إلى نشرتنا الإخبارية.",
        });
        form.reset();
      }
    } catch (error) {
        toast({
            title: "خطأ",
            description: "فشل الاشتراك. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
        });
    }
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm max-w-md text-gray-400">
              متجرك الشامل لكل ما تحتاجه. منتجات عالية الجودة وأسعار مذهلة وشحن سريع.
            </p>
            <ClientOnly>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">اشترك في نشرتنا الإخبارية</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onNewsletterSubmit)} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="email" placeholder="عنوان بريدك الإلكتروني" className="bg-gray-800 border-gray-700 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? '...' : 'اشترك'}
                    </Button>
                  </form>
                </Form>
              </div>
            </ClientOnly>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">تسوق</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=electronics" className="text-gray-400 hover:text-white">إلكترونيات</Link></li>
              <li><Link href="/products?category=fashion" className="text-gray-400 hover:text-white">أزياء</Link></li>
              <li><Link href="/products?category=home-furniture" className="text-gray-400 hover:text-white">المنزل والمطبخ</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white">كل المنتجات</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">اتصل بنا</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">الأسئلة الشائعة</Link></li>
              <li><Link href="/shipping-returns" className="text-gray-400 hover:text-white">الشحن والإرجاع</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-white">تتبع الطلب</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">قانوني</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">سياسة الخصوصية</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white">شروط الخدمة</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Doma Online Shop. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
             {loading ? (
                <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-5 bg-gray-700" />
                    <Skeleton className="h-5 w-5 bg-gray-700" />
                    <Skeleton className="h-5 w-5 bg-gray-700" />
                </div>
            ) : (
              <>
                {socialSettings?.facebookUrl && (
                  <Link href={socialSettings.facebookUrl} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </Link>
                )}
                {socialSettings?.instagramUrl && (
                  <Link href={socialSettings.instagramUrl} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </Link>
                )}
                {socialSettings?.tiktokUrl && (
                  <Link href={socialSettings.tiktokUrl} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                    <TikTokIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

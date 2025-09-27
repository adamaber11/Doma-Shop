

"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getHomepageSettings, updateHomepageSettings, getContactInfoSettings, updateContactInfoSettings, getAboutPageSettings, updateAboutPageSettings, getSocialMediaSettings, updateSocialMediaSettings } from '@/services/settings-service';
import type { HomepageSettings, ContactInfoSettings, AboutPageSettings, SocialMediaSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.52 7.04C12.52 6.47 12.99 6 13.56 6C14.13 6 14.6 6.47 14.6 7.04C14.6 7.61 14.13 8.08 13.56 8.08C12.99 8.08 12.52 7.61 12.52 7.04Z" />
        <path d="M16.92 4.45V13.84C16.92 16.48 14.82 18.58 12.18 18.58C9.54 18.58 7.44 16.48 7.44 13.84V4.45" />
        <path d="M12.18 18.58C12.18 18.58 12.22 18.58 12.26 18.58C13.88 18.58 15.22 17.5 15.65 16.05" />
        <path d="M7.44 4.45C7.44 4.45 7.42 4.45 7.4 4.45C6.06 4.45 5 5.51 5 6.85C5 8.19 6.06 9.25 7.4 9.25C7.42 9.25 7.44 9.25 7.44 9.25" />
    </svg>
)

const homepageSettingsSchema = z.object({
  heroTitle: z.string().min(3, "العنوان الرئيسي قصير جدًا"),
  heroSubtitle: z.string().min(10, "العنوان الفرعي قصير جدًا"),
  heroImageUrl: z.string().url("يجب أن يكون رابطًا صالحًا"),
});

const contactInfoSettingsSchema = z.object({
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(5, "رقم الهاتف قصير جدًا"),
    address: z.string().min(10, "العنوان قصير جدًا"),
});

const aboutPageSettingsSchema = z.object({
    aboutTitle: z.string().min(3, "العنوان قصير جدًا"),
    aboutSubtitle: z.string().min(10, "العنوان الفرعي قصير جدًا"),
    aboutHeroUrl: z.string().url("يجب أن يكون رابطًا صالحًا"),
    storyTitle: z.string().min(3, "العنوان قصير جدًا"),
    storyContent: z.string().min(10, "المحتوى قصير جدًا"),
    missionTitle: z.string().min(3, "العنوان قصير جدًا"),
    missionContent: z.string().min(10, "المحتوى قصير جدًا"),
    teamTitle: z.string().min(3, "العنوان قصير جدًا"),
    teamContent: z.string().min(10, "المحتوى قصير جدًا"),
    journeyTitle: z.string().min(3, "العنوان قصير جدًا"),
    journeyContent: z.string().min(10, "المحتوى قصير جدًا"),
});

const socialMediaSettingsSchema = z.object({
    facebookUrl: z.string().url("رابط فيسبوك غير صالح").or(z.literal("")),
    instagramUrl: z.string().url("رابط انستغرام غير صالح").or(z.literal("")),
    tiktokUrl: z.string().url("رابط تيك توك غير صالح").or(z.literal("")),
});

const combinedSchema = homepageSettingsSchema.merge(contactInfoSettingsSchema).merge(aboutPageSettingsSchema).merge(socialMediaSettingsSchema);

type SettingsFormValues = z.infer<typeof combinedSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(combinedSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const [homepageSettings, contactInfoSettings, aboutPageSettings, socialMediaSettings] = await Promise.all([
          getHomepageSettings(),
          getContactInfoSettings(),
          getAboutPageSettings(),
          getSocialMediaSettings(),
        ]);
        if (homepageSettings && contactInfoSettings && aboutPageSettings && socialMediaSettings) {
          form.reset({ ...homepageSettings, ...contactInfoSettings, ...aboutPageSettings, ...socialMediaSettings });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
        toast({ title: "خطأ", description: "فشل في جلب الإعدادات.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form, toast]);
  
  const heroImageUrl = form.watch('heroImageUrl');
  const aboutHeroUrl = form.watch('aboutHeroUrl');

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const homepageValues: HomepageSettings = {
        heroTitle: values.heroTitle,
        heroSubtitle: values.heroSubtitle,
        heroImageUrl: values.heroImageUrl,
      };
      const contactInfoValues: ContactInfoSettings = {
          email: values.email,
          phone: values.phone,
          address: values.address,
      };
       const aboutPageValues: AboutPageSettings = {
            aboutTitle: values.aboutTitle,
            aboutSubtitle: values.aboutSubtitle,
            aboutHeroUrl: values.aboutHeroUrl,
            storyTitle: values.storyTitle,
            storyContent: values.storyContent,
            missionTitle: values.missionTitle,
            missionContent: values.missionContent,
            teamTitle: values.teamTitle,
            teamContent: values.teamContent,
            journeyTitle: values.journeyTitle,
            journeyContent: values.journeyContent,
        };
      const socialMediaValues: SocialMediaSettings = {
        facebookUrl: values.facebookUrl,
        instagramUrl: values.instagramUrl,
        tiktokUrl: values.tiktokUrl,
      };

      await Promise.all([
        updateHomepageSettings(homepageValues),
        updateContactInfoSettings(contactInfoValues),
        updateAboutPageSettings(aboutPageValues),
        updateSocialMediaSettings(socialMediaValues),
      ]);
      toast({ title: "نجاح", description: "تم تحديث الإعدادات بنجاح." });
    } catch (error) {
      console.error("Failed to update settings", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعدادات.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-24 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-40 w-full' /></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الواجهة الرئيسية</CardTitle>
            <CardDescription>تخصيص محتوى قسم الهيرو في الصفحة الرئيسية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الرئيسي للهيرو</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الفرعي للهيرو</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="heroImageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة الهيرو</FormLabel>
                    <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
             )} />
              {heroImageUrl && (
                  <div>
                      <FormLabel>معاينة الصورة الحالية</FormLabel>
                      <div className="mt-2 relative aspect-video w-full max-w-lg rounded-md overflow-hidden border">
                          <Image src={heroImageUrl} alt="معاينة صورة الهيرو" fill className="object-cover"/>
                      </div>
                  </div>
              )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>إعدادات معلومات التواصل</CardTitle>
                <CardDescription>تعديل معلومات التواصل التي تظهر في صفحة "اتصل بنا".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>إعدادات التواصل الاجتماعي</CardTitle>
                <CardDescription>تعديل روابط التواصل الاجتماعي التي تظهر في الفوتر.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Facebook className="h-5 w-5" /> رابط فيسبوك</FormLabel>
                        <FormControl><Input placeholder="https://facebook.com/yourpage" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Instagram className="h-5 w-5" /> رابط انستغرام</FormLabel>
                        <FormControl><Input placeholder="https://instagram.com/yourprofile" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="tiktokUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><TikTokIcon className="h-5 w-5" /> رابط تيك توك</FormLabel>
                        <FormControl><Input placeholder="https://tiktok.com/@yourprofile" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>إعدادات صفحة "من نحن"</CardTitle>
                <CardDescription>تخصيص محتوى صفحة "من نحن".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField control={form.control} name="aboutTitle" render={({ field }) => (
                    <FormItem>
                        <FormLabel>العنوان الرئيسي</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="aboutSubtitle" render={({ field }) => (
                    <FormItem>
                        <FormLabel>العنوان الفرعي</FormLabel>
                        <FormControl><Textarea rows={3} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="aboutHeroUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة البطل</FormLabel>
                    <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {aboutHeroUrl && (
                    <div>
                        <FormLabel>معاينة الصورة</FormLabel>
                        <div className="mt-2 relative aspect-video w-full max-w-lg rounded-md overflow-hidden border">
                            <Image src={aboutHeroUrl} alt="معاينة صورة البطل" fill className="object-cover"/>
                        </div>
                    </div>
                )}
                
                <Separator className="my-8" />

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="storyTitle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان قسم "قصتنا"</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="storyContent" render={({ field }) => (
                        <FormItem>
                            <FormLabel>محتوى قسم "قصتنا"</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="missionTitle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان قسم "مهمتنا"</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="missionContent" render={({ field }) => (
                        <FormItem>
                            <FormLabel>محتوى قسم "مهمتنا"</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <Separator />
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="teamTitle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان قسم "فريقنا"</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="teamContent" render={({ field }) => (
                        <FormItem>
                            <FormLabel>محتوى قسم "فريقنا"</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <Separator />
                 <div className="grid md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="journeyTitle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان قسم "انضم لرحلتنا"</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="journeyContent" render={({ field }) => (
                        <FormItem>
                            <FormLabel>محتوى قسم "انضم لرحلتنا"</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                 </div>


            </CardContent>
        </Card>

        <div className='flex justify-end'>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ كل التغييرات'}
            </Button>
        </div>
      </form>
    </Form>
  );
}


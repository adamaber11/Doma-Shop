

"use client";

import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Building, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getAboutPageSettings } from "@/services/settings-service";
import type { AboutPageSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
    const [settings, setSettings] = useState<AboutPageSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const fetchedSettings = await getAboutPageSettings();
                setSettings(fetchedSettings);
            } catch (error) {
                console.error("Failed to fetch about page settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                </div>
                <Skeleton className="h-96 w-full rounded-lg mb-12" />
                <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 border rounded-lg">
                            <Skeleton className="h-12 w-12 mx-auto rounded-full mb-4" />
                            <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
                            <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                    ))}
                </div>
                 <div className="text-center">
                    <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full max-w-3xl mx-auto" />
                    <Skeleton className="h-4 w-2/3 max-w-3xl mx-auto mt-2" />
                </div>
            </div>
        );
    }
    
    if (!settings) {
        return <div className="container text-center py-12">فشل في تحميل محتوى الصفحة.</div>
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">{settings.aboutTitle}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {settings.aboutSubtitle}
        </p>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden mb-12">
        <Image
          src={settings.aboutHeroUrl || getPlaceholderImage("hero-1").imageUrl}
          alt="فريقنا"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
        <div className="p-6 border rounded-lg">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{settings.storyTitle}</h3>
          <p className="text-muted-foreground">
            {settings.storyContent}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Target className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{settings.missionTitle}</h3>
          <p className="text-muted-foreground">
            {settings.missionContent}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{settings.teamTitle}</h3>
          <p className="text-muted-foreground">
            {settings.teamContent}
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">{settings.journeyTitle}</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {settings.journeyContent}
        </p>
      </div>
    </div>
  );
}


import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Building, Target, Users } from "lucide-react";

export default function AboutPage() {
  const aboutImage = getPlaceholderImage("hero-1");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">عن دوما</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          اكتشف القصة وراء العلامة التجارية والتزامنا بالجودة.
        </p>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden mb-12">
        <Image
          src={aboutImage.imageUrl}
          alt="فريقنا"
          fill
          className="object-cover"
          data-ai-hint={aboutImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
        <div className="p-6 border rounded-lg">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">قصتنا</h3>
          <p className="text-muted-foreground">
            تأسست دوما في عام 2024، وبدأت بفكرة بسيطة: تقديم منتجات عالية الجودة وأنيقة للجميع.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Target className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">مهمتنا</h3>
          <p className="text-muted-foreground">
            تقديم تجربة تسوق لا مثيل لها مع مجموعة منسقة من المنتجات التي تلهم وتسعد.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">فريقنا</h3>
          <p className="text-muted-foreground">
            مجموعة شغوفة من الأفراد ملتزمون برضا العملاء والعثور على أفضل المنتجات لك.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">انضم إلى رحلتنا</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          نحن في نمو وتطور مستمر. تابعنا على قنوات التواصل الاجتماعي لتبقى على اطلاع على أحدث مجموعاتنا وعروضنا. شكرًا لكونك جزءًا من عائلة دوما.
        </p>
      </div>
    </div>
  );
}

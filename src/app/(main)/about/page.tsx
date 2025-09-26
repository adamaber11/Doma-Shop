
import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Building, Target, Users } from "lucide-react";

export default function AboutPage() {
  const aboutImage = getPlaceholderImage("hero-1");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">About Doma</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover the story behind the brand and our commitment to quality.
        </p>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden mb-12">
        <Image
          src={aboutImage.imageUrl}
          alt="Our Team"
          fill
          className="object-cover"
          data-ai-hint={aboutImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
        <div className="p-6 border rounded-lg">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Story</h3>
          <p className="text-muted-foreground">
            Founded in 2024, Doma started with a simple idea: to bring high-quality, stylish products to everyone.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Target className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-muted-foreground">
            To provide an unparalleled shopping experience with a curated selection of products that inspire and delight.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Team</h3>
          <p className="text-muted-foreground">
            A passionate group of individuals dedicated to customer satisfaction and finding the best products for you.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Join Our Journey</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          We are constantly growing and evolving. Follow us on our social media channels to stay updated on our latest collections and offers. Thank you for being a part of the Doma family.
        </p>
      </div>
    </div>
  );
}

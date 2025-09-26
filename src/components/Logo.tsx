import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShoppingBag className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight">
        ShopSphere
      </span>
    </Link>
  );
}

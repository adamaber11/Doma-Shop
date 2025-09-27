
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShoppingBag className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline tracking-tight">
        Do<span className="text-primary">m</span>a
      </span>
    </Link>
  );
}

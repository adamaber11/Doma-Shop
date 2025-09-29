
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShoppingBag className="h-12 w-12 text-primary" strokeWidth={2.5} />
      <span className="text-4xl font-extrabold font-headline tracking-tight">
        Do<span className="text-primary">m</span>a
      </span>
    </Link>
  );
}

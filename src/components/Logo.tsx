
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShoppingBag className="h-10 w-10 text-primary" strokeWidth={2.5} />
      <div className="flex flex-col">
        <span className="text-2xl font-black font-headline tracking-tight leading-none">
            Doma
        </span>
        <span className="text-xs font-semibold text-muted-foreground tracking-wider -mt-1">
            Online Shop
        </span>
      </div>
    </Link>
  );
}

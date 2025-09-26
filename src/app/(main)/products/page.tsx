import { Header } from '@/components/layout/Header';
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { allProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let products: Product[] = allProducts;
  const category = searchParams?.category;
  const price = searchParams?.price;

  if (category) {
    products = products.filter(p => p.categoryId === category);
  }

  if (price && typeof price === 'string') {
    const [min, max] = price.split('-').map(Number);
    products = products.filter(p => p.price >= min && p.price <= max);
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">منتجاتنا</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          <main className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">لم يتم العثور على منتجات</h2>
                <p className="text-muted-foreground">حاول تعديل الفلاتر للعثور على ما تبحث عنه.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl md:text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl md:text-4xl font-semibold font-headline">الصفحة غير موجودة</h2>
      <p className="mt-2 text-muted-foreground">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">العودة إلى الصفحة الرئيسية</Link>
      </Button>
    </div>
  )
}

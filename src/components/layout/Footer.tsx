import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.1 0 .8-.4 1.5-.9 2.2-1.2 1.9-3.9 3.1-6.7 3.6-2.5.5-5.1.4-7.6-.2-2.1-.5-4-1.6-5.5-3.2.1.1 1 .2 1.8.1 1.4-.2 2.7-.8 3.9-1.8-1.5-.1-2.9-1.1-3.4-2.5-.3 1.1.3 1.8 1.1 2-1.5-.3-2.8-1.5-3.1-3 .5.9 1.4 1.4 2.4 1.4-1.2-.8-2.1-2.3-2.1-4.1 0-1.5.7-2.9 1.8-3.9 1.7 2.1 4.2 3.6 7.2 3.7.1-2.8 2.3-5.1 5.1-5.1 1.4 0 2.8.6 3.7 1.7.9-.2 1.8-.5 2.6-1-.3.9-.9 1.7-1.6 2.1.8-.1 1.6-.3 2.3-.6z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm max-w-md text-gray-400">
              متجرك الشامل لكل ما تحتاجه. منتجات عالية الجودة وأسعار مذهلة وشحن سريع.
            </p>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">اشترك في نشرتنا الإخبارية</h3>
              <form className="flex gap-2">
                <Input type="email" placeholder="عنوان بريدك الإلكتروني" className="bg-gray-800 border-gray-700 text-white"/>
                <Button type="submit">اشترك</Button>
              </form>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">تسوق</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=electronics" className="text-gray-400 hover:text-white">إلكترونيات</Link></li>
              <li><Link href="/products?category=fashion" className="text-gray-400 hover:text-white">أزياء</Link></li>
              <li><Link href="/products?category=home-kitchen" className="text-gray-400 hover:text-white">المنزل والمطبخ</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white">كل المنتجات</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">اتصل بنا</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">الأسئلة الشائعة</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">الشحن والإرجاع</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">تتبع الطلب</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">قانوني</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">شروط الخدمة</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} دوما. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link href="#" aria-label="Twitter">
              <TwitterIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

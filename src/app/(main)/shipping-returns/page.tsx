
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Undo2 } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline">الشحن والإرجاع</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            معلومات حول سياسات الشحن والإرجاع لدينا.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6" />
                <span>سياسة الشحن</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                نقدم شحنًا قياسيًا على جميع الطلبات. تتم معالجة الطلبات في غضون 1-2 يوم عمل.
              </p>
              <p>
                - الشحن القياسي: 3-7 أيام عمل.
              </p>
              <p>
                - الشحن السريع: 1-3 أيام عمل.
              </p>
              <p>
                سيتم توفير رقم تتبع عبر البريد الإلكتروني بمجرد شحن طلبك. نحن نشحن حاليًا داخل الدولة فقط.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Undo2 className="h-6 w-6" />
                <span>سياسة الإرجاع</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                نقبل المرتجعات في غضون 14 يومًا من تاريخ التسليم. يجب أن تكون المنتجات غير مستخدمة وفي عبواتها الأصلية.
              </p>
              <p>
                لبدء عملية الإرجاع، يرجى الاتصال بفريق دعم العملاء لدينا على support@doma.com مع رقم طلبك.
              </p>
              <p>
                يتحمل العملاء مسؤولية تكاليف شحن الإرجاع ما لم يكن المنتج معيبًا أو تم إرساله عن طريق الخطأ. سيتم إصدار المبالغ المستردة إلى طريقة الدفع الأصلية.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}

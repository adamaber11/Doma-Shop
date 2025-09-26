import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function ConfirmationPage({ params }: { params: { orderId: string } }) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                  <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold mt-4 font-headline">شكرًا لطلبك!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              تم تقديم طلبك بنجاح. تم إرسال رسالة تأكيد بالبريد الإلكتروني إليك.
            </p>
            <div className="p-4 bg-secondary rounded-md">
              <p className="text-sm font-medium">رقم طلبك هو:</p>
              <p className="text-lg font-mono font-semibold text-primary">{params.orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              يمكنك تتبع حالة طلبك في قسم "طلباتي" في ملفك الشخصي.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" asChild>
                  <Link href="/products">متابعة التسوق</Link>
              </Button>
              <Button>
                  <Download className="ml-2 h-4 w-4"/>
                  تحميل الإيصال
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

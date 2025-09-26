
import { Header } from "@/components/layout/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نحن نقبل الدفع عن طريق بطاقات الائتمان (فيزا، ماستركارد)، باي بال، والتحويلات البنكية. كما نوفر خيار الدفع عند الاستلام في بعض المناطق."
    },
    {
      question: "كم يستغرق الشحن؟",
      answer: "يستغرق الشحن عادة من 3 إلى 7 أيام عمل داخل البلاد. قد تختلف أوقات الشحن الدولي."
    },
    {
      question: "هل يمكنني إرجاع منتج؟",
      answer: "نعم، يمكنك إرجاع المنتجات في غضون 14 يومًا من تاريخ الاستلام، بشرط أن تكون في حالتها الأصلية وغير مستخدمة. يرجى مراجعة سياسة الإرجاع لمزيد من التفاصيل."
    },
    {
      question: "كيف يمكنني تتبع طلبي؟",
      answer: "بمجرد شحن طلبك، ستتلقى رسالة بريد إلكتروني تحتوي على رقم تتبع ورابط لتتبع شحنتك مباشرة."
    },
    {
      question: "هل تقدمون الشحن الدولي؟",
      answer: "نعم، نحن نقدم الشحن إلى العديد من البلدان حول العالم. يتم احتساب تكاليف الشحن الدولي عند الدفع."
    }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline">الأسئلة الشائعة</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            كل ما تحتاج لمعرفته. إذا لم تجد إجابتك، فلا تتردد في الاتصال بنا.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-right">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}


"use client";

import { useEffect, useState } from 'react';
import { getSubscribers, deleteSubscriber, sendNewsletterToSubscribers } from '@/services/product-service';
import type { Subscriber } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Trash2, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function DashboardSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const fetchedSubscribers = await getSubscribers(true);
      setSubscribers(fetchedSubscribers);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast({ title: "خطأ", description: "فشل في جلب المشتركين.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (subscriberId: string) => {
    try {
      await deleteSubscriber(subscriberId);
      toast({ title: "نجاح", description: "تم حذف المشترك بنجاح." });
      fetchSubscribers();
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      toast({ title: "خطأ", description: "فشل في حذف المشترك.", variant: "destructive" });
    }
  };

  const handleSendNewsletter = async () => {
    if (!subject || !body) {
        toast({ title: 'خطأ', description: 'يرجى ملء حقل الموضوع والرسالة.', variant: 'destructive'});
        return;
    }
    
    setIsSending(true);
    try {
        const subscriberEmails = subscribers.map(s => s.email);
        await sendNewsletterToSubscribers(subscriberEmails, subject, body);
        
        toast({ title: 'تم إرسال الرسائل!', description: 'تمت إضافة رسائلك إلى قائمة انتظار الإرسال.' });
        setIsComposeOpen(false);
        setSubject('');
        setBody('');

    } catch(error) {
        console.error('Failed to send newsletter', error);
        toast({ title: 'خطأ', description: 'فشل في إرسال الرسالة الإخبارية. تأكد من تثبيت وتكوين امتداد "Trigger Email".', variant: 'destructive'});
    } finally {
        setIsSending(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مشتركو النشرة الإخبارية</h1>
        <Button onClick={() => setIsComposeOpen(true)} disabled={subscribers.length === 0}>
          <Send className="ml-2 h-4 w-4" />
          إرسال رسالة
        </Button>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال رسالة للمشتركين</DialogTitle>
            <DialogDescription>
              سيتم إرسال هذه الرسالة إلى جميع المشتركين ({subscribers.length}) تلقائيًا.
              <br/>
              <strong className='text-destructive'>ملاحظة:</strong> يجب تثبيت وتكوين امتداد Firebase "Trigger Email".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="subject">الموضوع</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="body">نص الرسالة (يدعم HTML)</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isSending}>إلغاء</Button>
            </DialogClose>
            <Button onClick={handleSendNewsletter} disabled={isSending}>
              {isSending ? (
                'جاري الإرسال...'
              ) : (
                <>
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الآن
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead className="hidden md:table-cell">تاريخ الاشتراك</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead className="hidden md:table-cell">تاريخ الاشتراك</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDistanceToNow(new Date(subscriber.subscribedAt), { addSuffix: true, locale: ar })}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيؤدي هذا إلى إلغاء اشتراك هذا المستخدم نهائيًا.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(subscriber.id)}>متابعة</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {!loading && subscribers.length === 0 && (
        <div className="text-center py-16 border rounded-lg">
          <h2 className="text-2xl font-semibold">لا يوجد مشتركين بعد</h2>
          <p className="text-muted-foreground mt-2">عندما يشترك المستخدمون في نشرتك الإخبارية، سيظهرون هنا.</p>
        </div>
      )}
    </div>
  );
}

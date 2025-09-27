

"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getShippingRates, addShippingRate, updateShippingRate, deleteShippingRate } from '@/services/settings-service';
import type { ShippingRate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formatCurrency } from '@/lib/utils';

const shippingRateSchema = z.object({
  governorate: z.string().min(2, "اسم المحافظة مطلوب"),
  cost: z.coerce.number().min(0, "التكلفة يجب أن تكون رقمًا موجبًا"),
});

export default function DashboardShippingPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingRateSchema>>({
    resolver: zodResolver(shippingRateSchema),
  });

  const fetchRates = async () => {
    setLoading(true);
    try {
      const fetchedRates = await getShippingRates();
      setRates(fetchedRates);
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      toast({ title: "خطأ", description: "فشل في جلب أسعار الشحن.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleOpenForm = (rate: ShippingRate | null = null) => {
    setEditingRate(rate);
    form.reset(rate ? { governorate: rate.governorate, cost: rate.cost } : { governorate: '', cost: 0 });
    setIsFormOpen(true);
  };
  
  const onSubmit = async (values: z.infer<typeof shippingRateSchema>) => {
    try {
        if (editingRate) {
            await updateShippingRate(editingRate.id, values);
            toast({ title: "نجاح", description: "تم تحديث سعر الشحن." });
        } else {
            await addShippingRate(values);
            toast({ title: "نجاح", description: "تمت إضافة سعر الشحن." });
        }
        fetchRates();
        setIsFormOpen(false);
    } catch (error) {
         toast({ title: "خطأ", description: "فشل في حفظ سعر الشحن.", variant: "destructive" });
    }
  };


  const handleDelete = async (rateId: string) => {
    try {
      await deleteShippingRate(rateId);
      toast({ title: "نجاح", description: "تم حذف سعر الشحن بنجاح." });
      fetchRates();
    } catch (error) {
      console.error('Failed to delete rate:', error);
      toast({ title: "خطأ", description: "فشل في حذف سعر الشحن.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">إدارة أسعار الشحن</h1>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة سعر جديد
                </Button>
            </DialogTrigger>
        </div>
        
        <DialogContent>
            <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{editingRate ? 'تعديل سعر الشحن' : 'إضافة سعر شحن جديد'}</DialogTitle>
                        <DialogDescription>
                            أدخل اسم المحافظة وتكلفة الشحن إليها.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <FormField control={form.control} name="governorate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>المحافظة</FormLabel>
                                <FormControl><Input placeholder="مثال: القاهرة" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="cost" render={({ field }) => (
                            <FormItem>
                                <FormLabel>تكلفة الشحن</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                    </DialogFooter>
                 </form>
            </Form>
        </DialogContent>


        {loading ? (
            <div className="border rounded-lg">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>المحافظة</TableHead>
                    <TableHead>تكلفة الشحن</TableHead>
                    <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
                    <TableHead>المحافظة</TableHead>
                    <TableHead>تكلفة الشحن</TableHead>
                    <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {rates.map((rate) => (
                    <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.governorate}</TableCell>
                    <TableCell>{formatCurrency(rate.cost)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleOpenForm(rate)}>
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل
                            </DropdownMenuItem>
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
                                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف سعر الشحن لهذه المحافظة.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(rate.id)}>متابعة</AlertDialogAction>
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
        { !loading && rates.length === 0 && (
            <div className="text-center py-16 border rounded-lg">
                <h2 className="text-2xl font-semibold">لم يتم العثور على أسعار شحن</h2>
                <p className="text-muted-foreground mt-2">ابدأ بإضافة سعر شحن جديد.</p>
            </div>
            )}
        </div>
    </Dialog>
  );
}

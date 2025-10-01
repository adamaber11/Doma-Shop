

"use client";

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/services/product-service';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrders(true); // Force refresh
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({ title: "خطأ", description: "فشل في جلب الطلبات.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: "نجاح", description: "تم تحديث حالة الطلب." });
      fetchOrders(); // Refresh list
    } catch (error) {
       console.error('Failed to update order status:', error);
       toast({ title: "خطأ", description: "فشل في تحديث حالة الطلب.", variant: "destructive" });
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
        await deleteOrder(orderId);
        toast({ title: "نجاح", description: "تم حذف الطلب بنجاح." });
        fetchOrders();
    } catch (error) {
        console.error('Failed to delete order:', error);
        toast({ title: "خطأ", description: "فشل في حذف الطلب.", variant: "destructive" });
    }
  };
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'pending': return 'default';
        case 'shipped': return 'secondary';
        case 'delivered': return 'outline';
        case 'cancelled': return 'destructive';
        default: return 'default';
    }
  }
   const getStatusText = (status: Order['status']) => {
    switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'shipped': return 'تم الشحن';
        case 'delivered': return 'تم التوصيل';
        case 'cancelled': return 'ملغي';
        default: return 'غير معروف';
    }
  }
  
  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    switch(method) {
        case 'cod': return 'عند الاستلام';
        default: return 'غير معروف';
    }
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الطلبات</h1>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الشحن</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
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
                <TableHead className="hidden md:table-cell">رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الشحن</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono hidden md:table-cell">{order.id}</TableCell>
                  <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.shippingAddress.governorate} - {order.shippingAddress.city}</div>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), "d MMMM yyyy", { locale: ar })}</TableCell>
                  <TableCell>{formatCurrency(order.shippingCost)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </TableCell>
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
                            <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>تغيير الحالة</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'pending')}>قيد الانتظار</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>تم الشحن</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>تم التوصيل</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>ملغي</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
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
                                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الطلب نهائيًا.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(order.id)}>متابعة</AlertDialogAction>
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
       { !loading && orders.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على طلبات</h2>
            <p className="text-muted-foreground mt-2">لم يتم إنشاء أي طلبات بعد.</p>
         </div>
        )}
    </div>
  );
}

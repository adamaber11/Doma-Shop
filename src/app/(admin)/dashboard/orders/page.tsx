

"use client";

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/services/product-service';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';


export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
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
              {orders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono hidden md:table-cell">{orders.length - index}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                <Eye className="ml-2 h-4 w-4" />
                                عرض التفاصيل
                            </DropdownMenuItem>
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
        
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>تفاصيل الطلب</DialogTitle>
                    <DialogDescription>
                        رقم الطلب: <span className="font-mono">{selectedOrder?.id}</span>
                    </DialogDescription>
                </DialogHeader>
                {selectedOrder && (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">معلومات العميل</h3>
                                <p className="text-sm"><strong>الاسم:</strong> {selectedOrder.customerName}</p>
                                <p className="text-sm"><strong>البريد الإلكتروني:</strong> {selectedOrder.customerEmail}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">عنوان الشحن</h3>
                                <p className="text-sm">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.governorate}</p>
                                <p className="text-sm">{selectedOrder.shippingAddress.country}, {selectedOrder.shippingAddress.zip}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                             <h3 className="font-semibold mb-2">المنتجات المطلوبة</h3>
                             <Table>
                                 <TableHeader>
                                     <TableRow>
                                         <TableHead>المنتج</TableHead>
                                         <TableHead>الكمية</TableHead>
                                         <TableHead>السعر</TableHead>
                                         <TableHead className="text-left">الإجمالي</TableHead>
                                     </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                     {selectedOrder.items.map((item, index) => (
                                         <TableRow key={index}>
                                             <TableCell>{item.productName}</TableCell>
                                             <TableCell>{item.quantity}</TableCell>
                                             <TableCell>{formatCurrency(item.price)}</TableCell>
                                             <TableCell className="text-left">{formatCurrency(item.price * item.quantity)}</TableCell>
                                         </TableRow>
                                     ))}
                                 </TableBody>
                             </Table>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2 text-sm">
                              <p className="flex justify-between"><span>المجموع الفرعي:</span> <span>{formatCurrency(selectedOrder.total - selectedOrder.shippingCost)}</span></p>
                              <p className="flex justify-between"><span>تكلفة الشحن:</span> <span>{formatCurrency(selectedOrder.shippingCost)}</span></p>
                              <Separator />
                              <p className="flex justify-between font-bold text-base"><span>الإجمالي الكلي:</span> <span>{formatCurrency(selectedOrder.total)}</span></p>
                           </div>
                           <div className="space-y-2 text-sm">
                              <p><strong>طريقة الدفع:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                              <p><strong>حالة الطلب:</strong> <Badge variant={getStatusVariant(selectedOrder.status)}>{getStatusText(selectedOrder.status)}</Badge></p>
                              <p><strong>تاريخ الطلب:</strong> {format(new Date(selectedOrder.createdAt), "d MMMM yyyy, h:mm a", { locale: ar })}</p>
                           </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}

    
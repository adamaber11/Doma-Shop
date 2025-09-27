
"use client";

import { useEffect, useState } from 'react';
import { getOrders } from '@/services/product-service'; // Assuming orders can be fetched by user
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
        return;
    }
    
    if (user) {
        const fetchOrders = async () => {
            setLoading(true);
            try {
            // In a real app, you would fetch orders for the logged-in user.
            // Here, we'll filter all orders by the user's email for demonstration.
            const allOrders = await getOrders(true);
            const userOrders = allOrders.filter(o => o.customerEmail === user.email);
            setOrders(userOrders);
            } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast({ title: "خطأ", description: "فشل في جلب طلباتك.", variant: "destructive" });
            } finally {
            setLoading(false);
            }
        };
        fetchOrders();
    }

  }, [user, authLoading, router, toast]);

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

  if (loading || authLoading) {
      return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell">رقم الطلب</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الإجمالي</TableHead>
                        <TableHead>الحالة</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
      
      {orders.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">رقم الطلب</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono hidden md:table-cell">{order.id}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "d MMMM yyyy", { locale: ar })}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
         <div className="text-center py-16 border rounded-lg flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-semibold">ليس لديك أي طلبات بعد</h2>
            <p className="text-muted-foreground mt-2">يبدو أنك لم تقم بأي طلبات. ابدأ التسوق الآن!</p>
            <Button asChild className="mt-6">
                <Link href="/products">تصفح المنتجات</Link>
            </Button>
         </div>
      )}
    </div>
  );
}

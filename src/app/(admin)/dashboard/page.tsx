
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts, getCategories, getOrders, getCustomers } from '@/services/product-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Tags, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/lib/types';

export default function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [products, categories, orders, customers] = await Promise.all([
          getProducts(true),
          getCategories(true),
          getOrders(true),
          getCustomers(true),
        ]);
        
        setProductCount(products.length);
        setCategoryCount(categories.length);
        
        const revenue = orders
            .filter(order => order.status === 'delivered')
            .reduce((sum, order) => sum + order.total, 0);
        setTotalRevenue(revenue);
        
        setCustomerCount(customers.length);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="h-8 w-24" />
            ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            )}
            <p className="text-xs text-muted-foreground">
              إجمالي الإيرادات من الطلبات المكتملة
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="h-8 w-16" />
            ) : (
                <div className="text-2xl font-bold">+{customerCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              إجمالي العملاء المسجلين في المتجر
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{productCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              إجمالي المنتجات في المتجر
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفئات</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{categoryCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              إجمالي فئات المنتجات
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

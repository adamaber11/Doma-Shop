

"use client";

import { useEffect, useState } from 'react';
import { getCustomers } from '@/services/product-service';
import type { Customer } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';


export default function DashboardCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const fetchedCustomers = await getCustomers(true); // Force refresh
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast({ title: "خطأ", description: "فشل في جلب العملاء.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">العملاء</h1>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className='space-y-2'>
                          <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
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
                <TableHead>العميل</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={customer.photoURL} alt={customer.name} />
                            <AvatarFallback><UserCircle /></AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{customer.name}</span>
                          <div className='text-sm text-muted-foreground'>{customer.email}</div>
                        </div>
                      </div>
                  </TableCell>
                  <TableCell>{format(new Date(customer.joinedAt), "d MMMM yyyy", { locale: ar })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
       { !loading && customers.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على عملاء</h2>
            <p className="text-muted-foreground mt-2">لا يوجد عملاء مسجلون بعد.</p>
         </div>
        )}
    </div>
  );
}

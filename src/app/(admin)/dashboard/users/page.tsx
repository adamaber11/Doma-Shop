
"use client";

import { useEffect, useState } from 'react';
import { getUsers, setUserAdminRole } from '@/services/user-service';
import type { UserRoleInfo } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Shield, ShieldCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<UserRoleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({ title: "خطأ", description: "فشل في جلب المستخدمين.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, isAdmin: boolean) => {
    // Optimistic UI update
    setUsers(prevUsers => prevUsers.map(user => user.uid === uid ? { ...user, isAdmin } : user));

    try {
      await setUserAdminRole(uid, isAdmin);
      toast({
        title: "نجاح",
        description: `تم ${isAdmin ? 'ترقية' : 'إزالة صلاحيات'} المستخدم بنجاح.`,
      });
      // Optionally re-fetch to confirm, but optimistic update should suffice for a good UX
      // await fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({ title: "خطأ", description: "فشل في تحديث دور المستخدم.", variant: "destructive" });
      // Revert UI on failure
      setUsers(prevUsers => prevUsers.map(user => user.uid === uid ? { ...user, isAdmin: !isAdmin } : user));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead className="text-left">مسؤول</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-left"><Skeleton className="h-6 w-12" /></TableCell>
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
                <TableHead>المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead className="text-left">مسؤول</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback><UserCircle /></AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.displayName || 'لا يوجد اسم'}</span>
                      </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>
                        {user.isAdmin ? (
                            <span className="flex items-center gap-2 text-primary font-medium"><ShieldCheck className="h-4 w-4"/> مسؤول</span>
                        ) : (
                             <span className="flex items-center gap-2 text-muted-foreground"><UserCircle className="h-4 w-4"/> عميل</span>
                        )}
                   </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-end space-x-2">
                        <Switch
                            id={`admin-switch-${user.uid}`}
                            checked={user.isAdmin}
                            onCheckedChange={(checked) => handleRoleChange(user.uid, checked)}
                            disabled={user.email === 'adamaber50@gmail.com'} // Disable changing role for the super admin
                        />
                        <Label htmlFor={`admin-switch-${user.uid}`} className="sr-only">تعيين كمسؤول</Label>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
       { !loading && users.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على مستخدمين</h2>
            <p className="text-muted-foreground mt-2">لا يوجد مستخدمون مسجلون بعد.</p>
         </div>
        )}
    </div>
  );
}

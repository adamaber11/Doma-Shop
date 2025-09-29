

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPopupAds, deletePopupAd } from '@/services/product-service';
import type { Ad } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DashboardPopupAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAds = async () => {
    setLoading(true);
    try {
      const fetchedAds = await getPopupAds(true); // Force refresh
      setAds(fetchedAds);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      toast({ title: "خطأ", description: "فشل في جلب الإعلانات المنبثقة.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (adId: string) => {
    try {
      await deletePopupAd(adId);
      toast({ title: "نجاح", description: "تم حذف الإعلان بنجاح." });
      fetchAds(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete ad:', error);
      toast({ title: "خطأ", description: "فشل في حذف الإعلان.", variant: "destructive" });
    }
  };

  const getDisplayPagesText = (pages: string[] = []) => {
    if (pages.includes('all')) return 'كل الصفحات';
    if (pages.includes('home')) return 'الرئيسية';
    if (pages.includes('products')) return 'المنتجات';
    return '-';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الإعلانات المنبثقة</h1>
        <Button asChild>
          <Link href="/dashboard/popup-ads/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة إعلان منبثق
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>صفحات العرض</TableHead>
                <TableHead>المدة (ث)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-24 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
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
                <TableHead className="w-[100px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>صفحات العرض</TableHead>
                <TableHead>المدة (ث)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="صورة الإعلان"
                      className="aspect-video rounded-md object-cover"
                      height="64"
                      src={ad.imageUrl}
                      width="128"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {getDisplayPagesText(ad.displayPages)}
                  </TableCell>
                  <TableCell>{ad.duration ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={ad.isActive ? 'default' : 'secondary'}>{ad.isActive ? 'نشط' : 'غير نشط'}</Badge>
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
                          <DropdownMenuItem asChild><Link href={`/dashboard/popup-ads/edit/${ad.id}`}>تعديل</Link></DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive focus:text-destructive">حذف</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الإعلان نهائيًا.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(ad.id)}>متابعة</AlertDialogAction>
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
       { !loading && ads.length === 0 && (
         <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">لم يتم العثور على إعلانات منبثقة</h2>
            <p className="text-muted-foreground mt-2">ابدأ بإضافة إعلان جديد.</p>
         </div>
        )}
    </div>
  );
}

    
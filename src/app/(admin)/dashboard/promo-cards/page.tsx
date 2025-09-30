
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPromoCards } from '@/services/product-service';
import type { PromoCard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Note: This page manages 4 specific cards. Deletion/Addition is disabled.

export default function DashboardPromoCardsPage() {
  const [cards, setCards] = useState<PromoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCards = async () => {
    setLoading(true);
    try {
      const fetchedCards = await getPromoCards(true);
      setCards(fetchedCards);
    } catch (error) {
      console.error('Failed to fetch promo cards:', error);
      toast({ title: "خطأ", description: "فشل في جلب البطاقات الترويجية.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">البطاقات الترويجية</h1>
        <p className="text-muted-foreground">إدارة البطاقات الأربع التي تظهر تحت قسم الهيرو.</p>
      </div>

      {loading ? (
        <div className="border rounded-lg">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>نص الرابط</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
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
                 <TableHead className="w-[100px] hidden sm:table-cell">الصورة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>نص الرابط</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={card.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={card.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{card.title}</TableCell>
                  <TableCell>{card.linkText}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/promo-cards/edit/${card.id}`}>تعديل</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

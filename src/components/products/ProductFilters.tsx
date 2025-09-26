"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { allCategories } from '@/lib/data';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    const priceParam = searchParams.get('price');
    if(priceParam) {
      const prices = priceParam.split('-').map(Number);
      if (prices.length === 2) {
        setPriceRange([prices[0], prices[1]]);
      }
    } else {
       setPriceRange([0, 2000]);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set('price', `${priceRange[0]}-${priceRange[1]}`);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الفلاتر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">الفئة</h3>
          <RadioGroup 
            defaultValue={searchParams.get('category') || 'all'}
            onValueChange={handleCategoryChange}
            >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">الكل</Label>
            </div>
            {allCategories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`cat-${category.id}`} />
                <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <h3 className="font-semibold mb-4">نطاق السعر</h3>
          <Slider
            min={0}
            max={2000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
          <Button onClick={applyPriceFilter} className="w-full mt-4">تطبيق السعر</Button>
        </div>
      </CardContent>
    </Card>
  );
}

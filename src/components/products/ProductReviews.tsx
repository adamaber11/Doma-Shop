
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Star, StarHalf, UserCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Product, Review } from '@/lib/types';
import { addReview } from '@/services/product-service';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ProductReviewsProps {
  product: Product;
  onReviewSubmit: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "التقييم مطلوب").max(5),
  comment: z.string().min(10, "التعليق يجب أن يكون 10 أحرف على الأقل").max(500),
});

export function ProductReviews({ product, onReviewSubmit }: ProductReviewsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) {
        toast({ title: "خطأ", description: "يجب تسجيل الدخول لترك تقييم.", variant: "destructive" });
        return;
    }
    try {
      await addReview(product.id, {
        author: user.displayName || 'مستخدم مجهول',
        ...values
      });
      toast({ title: "نجاح", description: "تم إرسال تقييمك." });
      form.reset();
      onReviewSubmit(); // Refresh product data
    } catch (error) {
      console.error("Failed to add review", error);
      toast({ title: "خطأ", description: "فشل في إضافة التقييم.", variant: "destructive" });
    }
  };

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
      return { star, count, percentage };
  });

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">تقييمات العملاء</h2>
        <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn("h-6 w-6", averageRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                ))}
            </div>
            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} تقييمات)</span>
        </div>
        <div className="space-y-2">
            {ratingDistribution.map(({star, count, percentage}) => (
                <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{star} نجوم</span>
                    <Progress value={percentage} className="w-full h-2" />
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                </div>
            ))}
        </div>
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>أضف تقييمك</CardTitle>
            </CardHeader>
            <CardContent>
                {user ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormItem>
                                <FormLabel>تقييمك</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={cn("h-7 w-7 cursor-pointer transition-colors", (hoveredRating || form.getValues('rating')) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onClick={() => form.setValue('rating', star, { shouldValidate: true })}
                                            />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormField control={form.control} name="comment" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تعليقك</FormLabel>
                                    <FormControl><Textarea placeholder="اكتب تعليقك هنا..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={form.formState.isSubmitting}>إرسال التقييم</Button>
                        </form>
                    </Form>
                ) : (
                    <p className="text-muted-foreground">يجب عليك <a href="/login" className="text-primary underline">تسجيل الدخول</a> لترك تقييم.</p>
                )}
            </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">أحدث التقييمات</h3>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
          {reviews.length > 0 ? (
             [...reviews].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map(review => (
                <div key={review.id} className="flex items-start gap-4">
                    <Avatar>
                        <AvatarFallback><UserCircle /></AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center justify-between">
                           <p className="font-semibold">{review.author}</p>
                           <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ar })}</span>
                        </div>
                        <div className="flex items-center my-1">
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} className={cn("h-4 w-4", review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                            ))}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                </div>
            ))
          ) : (
            <p className="text-muted-foreground py-8 text-center">لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يكتب تقييمًا!</p>
          )}
        </div>
      </div>
    </div>
  );
}

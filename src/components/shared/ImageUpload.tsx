

'use client';

// This component is no longer used for product images, but is kept for the settings page.
// It will be replaced there as well.

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSignature } from '@/services/image-upload-service';
import { useToast } from '@/hooks/use-toast';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        const uploadedPublicIds: string[] = [];

        for (const file of Array.from(files)) {
            try {
                const { timestamp, signature } = await getSignature();
                const formData = new FormData();
                formData.append('file', file);
                formData.append('signature', signature);
                formData.append('timestamp', timestamp);
                formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

                const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadedPublicIds.push(data.public_id);
                } else {
                    throw new Error('فشل الرفع');
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast({
                    title: 'خطأ في الرفع',
                    description: `فشل رفع الملف ${file.name}.`,
                    variant: 'destructive',
                });
            }
        }

        onChange([...value, ...uploadedPublicIds]);
        setIsUploading(false);
        toast({
            title: 'نجاح',
            description: `${uploadedPublicIds.length} صورة تم رفعها بنجاح.`,
        });
    };

    const handleRemoveImage = (publicIdToRemove: string) => {
        onChange(value.filter(publicId => publicId !== publicIdToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {value.map(publicId => (
                    <div key={publicId} className="relative group aspect-square">
                        <Image
                            src={getCloudinaryImageUrl(publicId)}
                            alt="صورة المنتج"
                            width={200}
                            height={200}
                            sizes="200px"
                            className="object-cover rounded-md border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(publicId)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <label htmlFor="image-upload" className="cursor-pointer aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                        <UploadCloud className="h-8 w-8" />
                    )}
                    <span className="text-xs mt-2 text-center">{isUploading ? 'جاري الرفع...' : 'رفع الصور'}</span>
                 </label>
            </div>
            <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
           
        </div>
    );
}

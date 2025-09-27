
// This file is no longer necessary as we are using direct URLs.
// We keep it to avoid breaking imports, but it's not actively used for new images.

export const getCloudinaryImageUrl = (publicId: string): string => {
  // This function is now a passthrough for URLs.
  // If the publicId is a full URL, return it directly.
  if (publicId.startsWith('http')) {
    return publicId;
  }
  // Fallback for old publicId format, though it's deprecated.
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!CLOUD_NAME) {
    return 'https://picsum.photos/seed/placeholder/600/400';
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_600/${publicId}`;
};

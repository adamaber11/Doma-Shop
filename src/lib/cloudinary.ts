
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!CLOUD_NAME) {
  console.warn("Cloudinary cloud name is not set in environment variables.");
}

export const getCloudinaryImageUrl = (publicId: string): string => {
  if (!publicId || !CLOUD_NAME) {
    // Return a default placeholder if publicId or cloud name is missing
    return 'https://picsum.photos/seed/placeholder/600/400';
  }
  // Example transformations: fetch format auto, quality auto, width 600
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_600/${publicId}`;
};

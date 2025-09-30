import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  width: number;
  height: number;
};

const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

const imagesById = placeholderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);

export function getPlaceholderImage(id: string): ImagePlaceholder {
  return imagesById[id] || {
    id: 'not-found',
    description: 'Image not found',
    imageUrl: 'https://picsum.photos/seed/notfound/600/400',
    imageHint: 'placeholder',
    width: 600,
    height: 400,
  };
}

export const allPlaceholderImages = placeholderImages;

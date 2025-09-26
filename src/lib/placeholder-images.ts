import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
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
  };
}

export const allPlaceholderImages = placeholderImages;

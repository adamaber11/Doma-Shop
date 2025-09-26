'use server';

/**
 * @fileOverview Recommends products based on browsing history and cart items.
 *
 * - getProductRecommendations - A function that recommends products.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history, as a comma separated list of product identifiers.'),
  cartItems: z
    .string()
    .describe('The items currently in the user\'s cart, as a comma separated list of product identifiers.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.string()).describe('An array of recommended product identifiers.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `أنت محرك توصية منتجات خبير.

  بناءً على سجل تصفح المستخدم والعناصر الموجودة في عربة التسوق الخاصة به ، أوصي بمنتجات أخرى قد يكون مهتمًا بها.

  سجل التصفح: {{{browsingHistory}}}
  عناصر سلة التسوق: {{{cartItems}}}

  إرجاع قائمة بمعرفات المنتج.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Recommends products based on browsing history and cart items.
 *
 * - getProductRecommendations - A function that recommends products.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import { getProducts } from '@/services/product-service';
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
  const allProducts = await getProducts();
  const productInfo = allProducts.map(p => `ID: ${p.id}, Name: ${p.name}, Description: ${p.description}`).join('\n');

  const prompt = `You are an expert product recommendation engine. Based on the user's browsing history, cart items, and the following list of all available products, recommend other products they might be interested in.

  Available Products:
  ${productInfo}

  User's Browsing History (Product IDs): ${input.browsingHistory}
  User's Cart Items (Product IDs): ${input.cartItems}

  Return a list of recommended product IDs.`;

  const llmResponse = await ai.generate({
      prompt: prompt,
      output: {
          schema: ProductRecommendationsOutputSchema
      }
  });

  return llmResponse.output || { recommendedProducts: [] };
}

import type { Ingredient } from '@/types';

export function scaleIngredient(ingredient: Ingredient, baseServings: number, targetServings: number): Ingredient {
  if (baseServings === 0) return ingredient;
  return {
    ...ingredient,
    quantity: Math.round((ingredient.quantity / baseServings) * targetServings * 10) / 10,
  };
}

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): Ingredient[] {
  return ingredients.map((i) => scaleIngredient(i, baseServings, targetServings));
}

export function formatQuantity(quantity: number): string {
  if (quantity === Math.floor(quantity)) return quantity.toString();
  const fractions: Record<number, string> = {
    0.25: '¼', 0.5: '½', 0.75: '¾',
    0.33: '⅓', 0.67: '⅔',
  };
  const wholeNumber = Math.floor(quantity);
  const decimal = Math.round((quantity - wholeNumber) * 100) / 100;
  const fraction = fractions[decimal];
  if (fraction) return wholeNumber > 0 ? `${wholeNumber}${fraction}` : fraction;
  return quantity.toString();
}

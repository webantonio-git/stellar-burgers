import React, { forwardRef } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerIngredient } from '../burger-ingredient/burger-ingredient';


type IngredientsCategoryUIProps = {
  title: string;
  titleRef?: React.RefObject<HTMLHeadingElement> | null;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
};

/**
 * ВАЖНО: не оборачиваем <BurgerIngredient /> в <li>,
 * т.к. сам BurgerIngredientUI (из @ui) рендерит <li>.
 */
export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  IngredientsCategoryUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => {
  return (
    <section id={title}>
      <h2 ref={titleRef ?? undefined} className="text text_type_main-medium mb-6">
        {title}
      </h2>

      <ul ref={ref}>
        {ingredients.map((item) => (
          <BurgerIngredient
            key={item._id}
            ingredient={item}
            count={ingredientsCounters[item._id] || 0}
          />
        ))}
      </ul>
    </section>
  );
});

IngredientsCategoryUI.displayName = 'IngredientsCategoryUI';

export default IngredientsCategoryUI;

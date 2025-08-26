import { FC } from 'react';
import { BurgerIngredientUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructor';
import { RootState } from '../../services/store';
import { useLocation } from 'react-router-dom';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const computedCount =
    count !== undefined
      ? count
      : ingredient.type === 'bun'
        ? bun?._id === ingredient._id
          ? 2
          : 0
        : ingredients.filter(
            (item: TConstructorIngredient) => item._id === ingredient._id
          ).length;

  const handleAdd = () => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={computedCount}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
};

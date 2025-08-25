import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = useCallback(() => {
      if (index >= totalItems - 1) return;
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index + 1 }));
    }, [dispatch, index, totalItems]);

    const handleMoveUp = useCallback(() => {
      if (index <= 0) return;
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index - 1 }));
    }, [dispatch, index]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredient(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

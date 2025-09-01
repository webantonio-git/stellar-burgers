import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { selectIsAuth } from '../../services/selectors';
import { useNavigate } from 'react-router-dom';
import { createOrder, resetOrder } from '../../services/slices/order';
import {
  selectOrderData,
  selectOrderLoading
} from '../../services/selectors/order';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);

  const price = useMemo(() => {
    const sumIngredients = ingredients.reduce(
      (acc, item) => acc + item.price,
      0
    );
    const bunPrice = bun ? bun.price * 2 : 0;
    return sumIngredients + bunPrice;
  }, [bun, ingredients]);

  const isAuth = useSelector(selectIsAuth);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!bun) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((i: TConstructorIngredient) => i._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const constructorItems = {
    bun,
    ingredients: ingredients as TConstructorIngredient[]
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

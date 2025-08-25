import React, { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';           
import styles from './orders-list.module.css';
import { OrdersListUIProps, TOrderInfo } from './type';
import { OrderCardUI } from '../order-card/order-card';
import { useAppSelector } from '../../..//hooks';
import { selectIngredients } from '../../..//services/selectors';
import { TOrder, TIngredient } from '@utils-types';

const MAX_INGREDIENTS = 6;

export const OrdersListUI: FC<OrdersListUIProps> = memo(({ orderByDate, orders }) => {
  const location = useLocation();                       
  const locationState = { background: location };       

  const allIngredients = useAppSelector(selectIngredients);

  const list: TOrder[] = useMemo(() => {
    const src = orderByDate && orderByDate.length ? orderByDate : orders ?? [];
    return [...src].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orderByDate, orders]);

  const ingMap = useMemo(() => {
    const map = new Map<string, TIngredient>();
    allIngredients.forEach(i => map.set(i._id, i));
    return map;
  }, [allIngredients]);

  const toOrderInfo = (o: TOrder): TOrderInfo => {
    const ingredientsInfo: TIngredient[] = o.ingredients
      .map(id => ingMap.get(id))
      .filter(Boolean) as TIngredient[];

    const total = ingredientsInfo.reduce((sum, ing) => {
      if (ing.type === 'bun') return sum + (ing.price || 0) * 2;
      return sum + (ing.price || 0);
    }, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);
    const remains = Math.max(ingredientsInfo.length - MAX_INGREDIENTS, 0);

    return {
      _id: o._id,
      number: o.number,
      name: o.name,
      status: o.status,
      ingredients: o.ingredients,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(o.createdAt)
    };
  };

  if (!list.length) return <div className="pt-10">Нет заказов</div>;

  return (
    <div className={styles.content}>
      {list.map((o) => (
        <OrderCardUI
          key={o._id}
          orderInfo={toOrderInfo(o)}
          maxIngredients={MAX_INGREDIENTS}
          locationState={locationState}                  
        />
      ))}
    </div>
  );
});

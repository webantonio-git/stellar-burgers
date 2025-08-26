import { FC, useEffect, useMemo, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../services/selectors';
import { getIngredients } from '../../services/slices/ingredients';
import { getOrderByNumberApi } from '@api';
import styles from '../ui/order-info/order-info.module.css';
import { GlobalLoadingContext } from '../app/app';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const isModal = Boolean((location.state as any)?.background);
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const showGlobalPreloader = useContext(GlobalLoadingContext);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch]);

  useEffect(() => {
    let ignore = false;
    const num = Number(number);
    if (!Number.isFinite(num)) return;

    setLoading(true);
    getOrderByNumberApi(num)
      .then((res) => {
        const data = res?.orders?.[0] || null;
        if (!ignore) setOrderData(data);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || ingredients.length === 0) return null;

    const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
      {};
    let total = 0;

    for (const id of orderData.ingredients) {
      const ing = ingredients.find((i) => i._id === id);
      if (!ing) continue;
      total += ing.price;
      if (!ingredientsInfo[id]) {
        ingredientsInfo[id] = { ...ing, count: 1 };
      } else {
        ingredientsInfo[id].count += 1;
      }
    }

    const date = new Date(orderData.createdAt);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || loading) {
    return showGlobalPreloader ? null : <Preloader />;
  }

  const content = <OrderInfoUI orderInfo={orderInfo} />;

  return isModal ? content : <div className={styles.pageCenter}>{content}</div>;
};

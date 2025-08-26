import { FC, useEffect, useContext } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { feedActions } from '../../services/slices/feed';
import { getIngredients } from '../../services/slices/ingredients';

import {
  selectFeedLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors/feed';
import { selectIngredients } from '../../services/selectors';
import { GlobalLoadingContext } from '../../components/app/app';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const showGlobalPreloader = useContext(GlobalLoadingContext);

  const isLoading = useAppSelector(selectFeedLoading);
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    dispatch(feedActions.connect());

    if (!ingredients || ingredients.length === 0) {
      dispatch(getIngredients());
    }
    return () => {
      dispatch(feedActions.disconnect());
    };
  }, [dispatch]);

  if (isLoading && orders.length === 0 && !showGlobalPreloader) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} total={total} totalToday={totalToday} />;
};

export default Feed;

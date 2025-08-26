import { FC, useMemo } from 'react';

import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors/feed';

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  const readyOrders = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'done')
        .map((o) => o.number)
        .slice(0, 20),
    [orders]
  );

  const pendingOrders = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'pending')
        .map((o) => o.number)
        .slice(0, 20),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};

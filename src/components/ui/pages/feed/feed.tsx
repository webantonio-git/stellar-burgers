import { FC, useMemo } from 'react';
import styles from './feed.module.css';

import { OrdersListUI, FeedInfoUI } from '@ui';
import { TOrder } from '@utils-types';

type FeedUIProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const Feed: FC<FeedUIProps> = ({ orders, total, totalToday }) => {
  const orderByDate = useMemo(
    () =>
      [...(orders ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const readyOrders = useMemo(
    () =>
      orderByDate
        .filter((o) => o.status === 'done')
        .map((o) => o.number)
        .slice(0, 14),
    [orderByDate]
  );

  const inWorkOrders = useMemo(
    () =>
      orderByDate
        .filter((o) => o.status !== 'done')
        .map((o) => o.number)
        .slice(0, 14),
    [orderByDate]
  );

  return (
    <section className={styles.containerMain}>
      <div className={styles.titleBox}>
        <h1 className='text text_type_main-large mt-10 mb-5'>Лента заказов</h1>
      </div>

      <div className={styles.columns}>
        <div className={styles.columnOrders}>
          <OrdersListUI orders={orderByDate} />
        </div>

        <div className={styles.columnInfo}>
          <FeedInfoUI
            feed={{ total, totalToday }}
            readyOrders={readyOrders}
            pendingOrders={inWorkOrders}
          />
        </div>
      </div>
    </section>
  );
};

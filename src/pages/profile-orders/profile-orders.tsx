import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { getOrdersApi } from '@api';

export const ProfileOrders: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);

  useEffect(() => {
    let ignore = false;
    getOrdersApi()
      .then((list) => {
        if (!ignore) setOrders(list);
      })
      .catch(() => {
        if (!ignore) setOrders([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};

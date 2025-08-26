import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const location = useLocation();

    const isProfile = location.pathname.startsWith('/profile/orders');
    const to = `${isProfile ? '/profile/orders' : '/feed'}/${orderInfo.number}`;

    return (
      <li>
        <Link to={to} state={locationState} className={styles.order}>
          <div className={styles.header}>
            <p className='text text_type_digits-default'>#{orderInfo.number}</p>
            <FormattedDate
              date={new Date(orderInfo.createdAt)}
              className='text text_type_main-default text_color_inactive'
            />
          </div>

          <p className='text text_type_main-medium mt-6 mb-2'>
            {orderInfo.name}
          </p>
          {orderInfo.status && <OrderStatus status={orderInfo.status} />}

          <div className={`${styles.footer} mt-6`}>
            <ul className={styles.ingredients}>
              {orderInfo.ingredientsToShow
                .slice(0, maxIngredients)
                .map((ing, idx) => (
                  <li
                    key={ing._id + idx}
                    className={styles.ingredient}
                    style={{ zIndex: 10 - idx }}
                  >
                    <img
                      className={styles.ingredient_img}
                      src={ing.image_mobile || ing.image}
                      alt={ing.name}
                    />
                  </li>
                ))}
              {orderInfo.remains > 0 && (
                <li className={styles.ingredient}>
                  <span
                    className={`text text_type_main-default ${styles.counter}`}
                  >
                    +{orderInfo.remains}
                  </span>
                </li>
              )}
            </ul>

            <div className={styles.total}>
              <span
                className={`text text_type_digits-default pr-1 ${styles.order_total}`}
              >
                {orderInfo.total}
              </span>
              <CurrencyIcon type='primary' />
            </div>
          </div>
        </Link>
      </li>
    );
  }
);

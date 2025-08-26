import React from 'react';

type Props = { status?: 'done' | 'pending' | 'created' | string };

const TEXT: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан'
};

export const OrderStatus: React.FC<Props> = ({ status = '' }) => {
  const text = TEXT[status] ?? '';
  if (!text) return null;

  // как в эталоне: зелёный только для done, остальные — обычный цвет
  const colorClass = status === 'done' ? 'text_color_success' : '';

  return <p className={`text text_type_main-default ${colorClass}`}>{text}</p>;
};

export default OrderStatus;

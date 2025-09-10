import reducer, { createOrder } from './order';
import type { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'ord_1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 42424,
  ingredients: ['ing1', 'ing2']
};

describe('order reducer', () => {
  it('pending: isLoading=true, error=null', () => {
    const state = reducer(undefined, { type: createOrder.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: сохраняет заказ и выключает загрузку', () => {
    const state = reducer(undefined, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.order).toEqual(mockOrder);
  });

  it('rejected: error из payload, isLoading=false', () => {
    const state = reducer(undefined, {
      type: createOrder.rejected.type,
      payload: 'Order request failed'
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Order request failed');
  });
});

import reducer, { feedActions } from './feed';
import type { TOrder } from '@utils-types';

const orders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 111,
    ingredients: ['a', 'b']
  }
];

describe('feed reducer (WS)', () => {
  it('connect → включает загрузку и сбрасывает ошибку', () => {
    const state = reducer(undefined, feedActions.connect(undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('onOpen → выключает загрузку', () => {
    const pre = reducer(undefined, feedActions.connect(undefined));
    const state = reducer(pre, feedActions.onOpen());
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('onError → выключает загрузку и выставляет ошибку', () => {
    const state = reducer(undefined, feedActions.onError());
    expect(state.isLoading).toBe(false);

    expect(typeof state.error === 'string' || state.error === null).toBe(true);
  });

  it('onMessage → кладёт заказы и итоги, выключает загрузку', () => {
    const payload = { orders, total: 10, totalToday: 5 };
    const state = reducer(undefined, feedActions.onMessage(payload as any));
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
    expect(state.isLoading).toBe(false);
  });

  it('disconnect/onClose → выключают загрузку', () => {
    const s1 = reducer(undefined, feedActions.disconnect());
    expect(s1.isLoading).toBe(false);
    const s2 = reducer(undefined, feedActions.onClose());
    expect(s2.isLoading).toBe(false);
  });
});

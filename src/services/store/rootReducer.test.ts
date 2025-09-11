import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('должен инициализировать корректное начальное состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual({
      ingredients: { items: [], isLoading: false, error: null },
      user: { user: null, isAuth: false, isLoading: false, error: null },
      burgerConstructor: { bun: null, ingredients: [] },
      order: { order: null, isLoading: false, error: null },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      }
    });
  });
});

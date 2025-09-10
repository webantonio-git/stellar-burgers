import { combineReducers } from '@reduxjs/toolkit';
import ingredients from '../slices/ingredients';
import user from '../slices/user';
import constructorReducer from '../slices/constructor';
import order from '../slices/order';
import feed from '../slices/feed';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    ingredients,
    user,
    burgerConstructor: constructorReducer,
    order,
    feed
  });

  it('возвращает корректное начальное состояние для неопознанного экшена', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
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

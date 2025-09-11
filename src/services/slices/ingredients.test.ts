import reducer, { getIngredients } from '../slices/ingredients';
import type { TIngredient } from '@utils-types';

describe('ingredients async thunk reducer', () => {
  it('pending устанавливает isLoading=true и сбрасывает ошибку', () => {
    const state = reducer(undefined, { type: getIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled сохраняет элементы и выключает загрузку', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'A',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 1,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const state = reducer(undefined, {
      type: getIngredients.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(payload);
  });

  it('rejected сохраняет ошибку и выключает загрузку', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'boom' }
    };
    const state = reducer(undefined, action as any);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('boom');
  });
});

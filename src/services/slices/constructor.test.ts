import reducer, {
  addIngredient,
  removeIngredient,
  clearConstructor
} from '../slices/constructor';
import type { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1000,
  image: '',
  image_mobile: '',
  image_large: ''
};

const main: TIngredient = {
  _id: 'main1',
  name: 'Котлета астероидная',
  type: 'main',
  proteins: 300,
  fat: 50,
  carbohydrates: 25,
  calories: 900,
  price: 500,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructor reducer', () => {
  it('добавляет булку и начинку, затем удаляет начинку', () => {
    let state = reducer(undefined, { type: 'UNKNOWN' });

    state = reducer(state, addIngredient(bun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe('Булка N-200i');

    state = reducer(state, addIngredient(main));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Котлета астероидная');

    const idToRemove = state.ingredients[0].id as string;
    state = reducer(state, removeIngredient(idToRemove));
    expect(state.ingredients).toHaveLength(0);

    state = reducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});

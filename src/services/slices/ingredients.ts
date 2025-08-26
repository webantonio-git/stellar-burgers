import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  async () => {
    const raw = (await getIngredientsApi()) as unknown;

    if (raw && typeof raw === 'object' && 'data' in (raw as any)) {
      return ((raw as any).data ?? []) as TIngredient[];
    }

    if (Array.isArray(raw)) {
      return raw as TIngredient[];
    }

    return [];
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Failed to load ingredients';
      });
  }
});

export const { setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;

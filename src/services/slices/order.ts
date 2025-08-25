import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import { clearConstructor } from './constructor';

type OrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null
};



export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, thunkApi) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
   
    thunkApi.dispatch(clearConstructor());
    return res.order;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message ?? 'Order request failed');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.order = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Order request failed';
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

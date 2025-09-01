import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    connect: (state, _action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state) => {
      state.isLoading = false;
    },
    onOpen: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    onClose: (state) => {
      state.isLoading = false;
    },
    onError: (state) => {
      state.isLoading = false;
      state.error = 'ws error';
    },
    onMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      const { orders, total, totalToday } = action.payload || {
        orders: [],
        total: 0,
        totalToday: 0
      };
      state.orders = orders ?? [];
      state.total = total ?? 0;
      state.totalToday = totalToday ?? 0;
      state.isLoading = false;
    }
  }
});

export const feedActions = feedSlice.actions;
export default feedSlice.reducer;

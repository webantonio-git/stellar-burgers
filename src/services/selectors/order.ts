import { RootState } from '../store';

export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderData = (state: RootState) => state.order.order;
export const selectOrderError = (state: RootState) => state.order.error;

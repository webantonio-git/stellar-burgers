import { RootState } from '../store';

export const selectIsAuth = (state: RootState) => state.user.isAuth;

export const selectUser = (state: RootState) => ({
  name: state.user.user?.name ?? '',
  email: state.user.user?.email ?? ''
});

export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

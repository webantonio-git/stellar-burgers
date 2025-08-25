import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type UserState = {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    return res;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await registerUserApi(data);
    return res;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  try {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch {}
  return;
});

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const res = await getUserApi();
  return res;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: { name: string; email: string; password: string }) => {
    const res = await updateUserApi(data);
    return res;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        try {
          if (action.payload.accessToken) {
            setCookie('accessToken', action.payload.accessToken);
          }
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        } catch {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
      })

    
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        try {
          if (action.payload.accessToken) {
            setCookie('accessToken', action.payload.accessToken);
          }
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        } catch {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = null;
      })

     
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        try {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        } catch {}
      })

 
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

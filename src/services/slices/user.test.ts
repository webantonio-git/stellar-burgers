import reducer, { loginUser, logoutUser, fetchUser, updateUser } from './user';

beforeAll(() => {
  if (!('localStorage' in window)) {
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: () => {}, getItem: () => null, removeItem: () => {} },
      writable: true
    });
  }
});

const payloadAuth = {
  user: { email: 'test@example.com', name: 'Tester' },
  accessToken: 'Bearer token',
  refreshToken: 'refresh'
};

describe('user reducer', () => {
  it('loginUser.pending → isLoading=true, error=null', () => {
    const state = reducer(undefined, { type: loginUser.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUser.fulfilled → isAuth=true, user заполнен', () => {
    const state = reducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: payloadAuth
    });
    expect(state.isLoading).toBe(false);
    expect(state.isAuth).toBe(true);
    expect(state.user).toEqual(payloadAuth.user);
    expect(state.error).toBeNull();
  });

  it('loginUser.rejected → isLoading=false, error задан', () => {
    const state = reducer(undefined, {
      type: loginUser.rejected.type,
      error: { message: 'login failed' }
    } as any);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeTruthy();
  });

  it('fetchUser.pending → fulfilled: подтягивает пользователя и isAuth=true', () => {
    const pending = reducer(undefined, { type: fetchUser.pending.type });
    expect(pending.isLoading).toBe(true);
    const fulfilled = reducer(pending, {
      type: fetchUser.fulfilled.type,
      payload: { user: payloadAuth.user }
    });
    expect(fulfilled.isLoading).toBe(false);
    expect(fulfilled.isAuth).toBe(true);
    expect(fulfilled.user).toEqual(payloadAuth.user);
  });

  it('fetchUser.rejected → isLoading=false, isAuth=false, user=null, error=null (как в слайсе)', () => {
    const state = reducer(undefined, {
      type: fetchUser.rejected.type,
      error: { message: 'no token' }
    } as any);
    expect(state.isLoading).toBe(false);
    expect(state.isAuth).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('updateUser.fulfilled → обновляет user', () => {
    const pre = reducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: payloadAuth
    });
    const updated = reducer(pre, {
      type: updateUser.fulfilled.type,
      payload: { user: { email: 't@e.com', name: 'New Name' } }
    });
    expect(updated.user).toEqual({ email: 't@e.com', name: 'New Name' });
  });

  it('logoutUser.fulfilled → сбрасывает состояние', () => {
    const pre = reducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: payloadAuth
    });
    const state = reducer(pre, { type: logoutUser.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

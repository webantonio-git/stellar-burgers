import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredients from './slices/ingredients';
import user from './slices/user';
import constructorReducer from './slices/constructor';
import order from './slices/order';
import feed, { feedActions } from './slices/feed';

export const rootReducer = combineReducers({
  ingredients,
  user,
  burgerConstructor: constructorReducer,
  order,
  feed
});

export type RootState = ReturnType<typeof rootReducer>;

const WS_PUBLIC_URL = 'wss://norma.nomoreparties.space/orders/all';
const WS_USER_URL = 'wss://norma.nomoreparties.space/orders';

const readAccessToken = (): string => {
  const m = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  if (!m) return '';
  const raw = decodeURIComponent(m[1]);
  return raw.replace(/^Bearer\s+/i, '');
};

const createSocketMiddleware = (
  defaultUrl: string,
  actions: any,
  withAuth: boolean = false
): Middleware<{}, RootState> => {
  let socket: WebSocket | null = null;

  return (_store: MiddlewareAPI) => (next) => (action) => {
    if (typeof action !== 'object' || action === null || !('type' in action)) {
      return next(action);
    }

    switch (action.type) {
      case actions.connect?.type: {
        let url: string = (action as any).payload || defaultUrl;

        if (withAuth) {
          const token = readAccessToken();
          if (token) {
            const sep = url.includes('?') ? '&' : '?';
            url = `${url}${sep}token=${token}`;
          }
        }

        if (socket) {
          try {
            socket.close();
          } catch {}
        }

        socket = new WebSocket(url);

        socket.onopen = () => {
          try {
            _store.dispatch(actions.onOpen?.(undefined as any));
          } catch {}
        };

        socket.onerror = (e: Event) => {
          const message =
            (e as unknown as { message?: string })?.message ||
            'WebSocket error';
          try {
            _store.dispatch(actions.onError?.(message as any));
          } catch {}
        };

        socket.onclose = (e: CloseEvent) => {
          const payload = {
            code: e.code,
            reason: e.reason,
            wasClean: e.wasClean
          };
          try {
            _store.dispatch(actions.onClose?.(payload as any));
          } catch {}
        };

        socket.onmessage = (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data as string);
            _store.dispatch(actions.onMessage?.(data));
          } catch {
            try {
              _store.dispatch(actions.onError?.('Bad WS message JSON' as any));
            } catch {}
          }
        };

        break;
      }

      case actions.disconnect?.type: {
        if (socket) {
          try {
            socket.close(1000, 'Client disconnect');
          } catch {}
        }
        socket = null;
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

const feedWs = createSocketMiddleware(WS_PUBLIC_URL, feedActions);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [
          'feed/onOpen',
          'feed/onClose',
          'feed/onError',
          'profileFeed/onOpen',
          'profileFeed/onClose',
          'profileFeed/onError'
        ],
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta'],
        ignoredPaths: ['ws.socket']
      }
    }).concat(feedWs),
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

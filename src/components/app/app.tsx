import React, { FC, useEffect, useState, createContext } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients';
import { selectIngredientsLoading } from '../../services/selectors';
import { Preloader } from '../ui';
import { fetchUser } from '../../services/slices/user';
import { selectUserLoading } from '../../services/selectors/user';

export const GlobalLoadingContext = createContext(false);

const AUTH_ROUTE_RE = /^\/(login|register|forgot-password|reset-password)\/?$/;

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const isUserLoading = useSelector(selectUserLoading);

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.allSettled([
      dispatch(fetchUser()),
      dispatch(getIngredients())
    ]).finally(() => {
      if (!ignore) setAppReady(true);
    });
    return () => {
      ignore = true;
    };
  }, [dispatch]);

  const state = location.state as { background?: any };
  const background = state && state.background;

  const handleCloseModal = () => navigate(-1);

  const isAuthPage = AUTH_ROUTE_RE.test(location.pathname);

  const showGlobalPreloader =
    (!appReady || isIngredientsLoading || isUserLoading) && !isAuthPage;

  return (
    <GlobalLoadingContext.Provider value={showGlobalPreloader}>
      <div className={styles.app}>
        <AppHeader />

        {showGlobalPreloader && (
          <div className={styles.globalPreloader}>
            <div className={styles.globalPreloaderInner}>
              <Preloader />
            </div>
          </div>
        )}

        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />

          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal title='' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </GlobalLoadingContext.Provider>
  );
};

export default App;

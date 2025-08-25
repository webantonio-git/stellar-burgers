import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuth, selectUserLoading } from '../../services/selectors/user';
import { Preloader } from '../ui';

type TProtectedRouteProps = PropsWithChildren<{

  onlyUnAuth?: boolean;
}>;


export const ProtectedRoute: FC<TProtectedRouteProps> = ({ onlyUnAuth = false, children }) => {
  const location = useLocation();
  const isAuth = useSelector(selectIsAuth);
  const isUserLoading = useSelector(selectUserLoading);

  if (isUserLoading) {
    return <Preloader />;
  }


  if (onlyUnAuth && isAuth) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

 
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

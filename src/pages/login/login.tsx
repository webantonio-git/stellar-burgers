import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserError,
  selectUserLoading,
  selectIsAuth
} from '../../services/selectors/user';
import { loginUser } from '../../services/slices/user';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    if (isAuth) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuth, navigate, location.state]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isLoading) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

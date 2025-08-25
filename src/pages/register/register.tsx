import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserError,
  selectUserLoading,
  selectIsAuth
} from '../../services/selectors/user';
import { registerUser } from '../../services/slices/user';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('');
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
      dispatch(registerUser({ email, password, name: userName }));
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

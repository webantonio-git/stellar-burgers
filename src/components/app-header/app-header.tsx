import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors/user';

export const AppHeader: FC = () => {
  const { name } = useSelector(selectUser);

  return <AppHeaderUI userName={name || ''} />;
};

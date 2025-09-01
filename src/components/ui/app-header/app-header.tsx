import { FC } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export type TAppHeaderUIProps = {
  userName?: string;
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  const constructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const feedActive = pathname.startsWith('/feed');
  const profileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={`${styles.link} p-5 ${constructorActive ? styles.active : ''}`}
          >
            <BurgerIcon type={constructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Конструктор</p>
          </NavLink>

          <NavLink
            to='/feed'
            className={`${styles.link} p-5 ${feedActive ? styles.active : ''}`}
          >
            <ListIcon type={feedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <Link to='/' className={styles.logoLink}>
          <Logo className={styles.logoImg} />
        </Link>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={`${styles.link} p-5 ${profileActive ? styles.active : ''}`}
          >
            <ProfileIcon type={profileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

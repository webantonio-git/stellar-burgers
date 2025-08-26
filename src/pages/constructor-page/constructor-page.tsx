import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useContext } from 'react'; // ⬅️ добавили useContext
import { selectIngredientsLoading } from '../../services/selectors';
import { GlobalLoadingContext } from '../../components/app/app'; // ⬅️ добавили контекст

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const showGlobalPreloader = useContext(GlobalLoadingContext); // ⬅️ узнаём, показан ли глобальный прелоадер

  return (
    <>
      {isIngredientsLoading && !showGlobalPreloader ? ( // ⬅️ не дублируем, если глобальный уже активен
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};

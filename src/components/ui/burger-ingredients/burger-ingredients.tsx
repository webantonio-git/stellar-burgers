import React, { FC, memo, useMemo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredients.module.css';
import type { BurgerIngredientsUIProps } from './type';
import { useSelector } from '../../../services/store';
import { RootState } from '../../../services/store';
import { IngredientsCategoryUI } from '@ui';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => {
    const { bun, ingredients: constructorItems } = useSelector(
      (state: RootState) => state.burgerConstructor
    );

    const ingredientsCounters = useMemo(() => {
      const map: Record<string, number> = {};
      if (bun) map[bun._id] = 2;
      constructorItems.forEach((item) => {
        map[item._id] = (map[item._id] || 0) + 1;
      });
      return map;
    }, [bun, constructorItems]);

    return (
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>

        <div className={styles.content}>
          <IngredientsCategoryUI
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
            ingredientsCounters={ingredientsCounters}
          />
          <IngredientsCategoryUI
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
            ingredientsCounters={ingredientsCounters}
          />
          <IngredientsCategoryUI
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
            ingredientsCounters={ingredientsCounters}
          />
        </div>
      </section>
    );
  }
);

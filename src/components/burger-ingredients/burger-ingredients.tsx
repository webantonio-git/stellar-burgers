import React, { FC, useMemo, useRef, useState } from 'react';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);

  const buns = useMemo(
    () => ingredients.filter((i: TIngredient) => i.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((i: TIngredient) => i.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((i: TIngredient) => i.type === 'sauce'),
    [ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const bunsRef = (_node?: Element | null) => {};
  const mainsRef = (_node?: Element | null) => {};
  const saucesRef = (_node?: Element | null) => {};

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};

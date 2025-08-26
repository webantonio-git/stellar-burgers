import { FC, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors/ingredients';
import { getIngredients } from '../../services/slices/ingredients';
import { GlobalLoadingContext } from '../app/app';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const items = useSelector(selectIngredients);
  const showGlobalPreloader = useContext(GlobalLoadingContext);

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch]);

  const ingredientData = items?.find((i) => i._id === id) || null;

  if (!ingredientData || isLoading) {
    return showGlobalPreloader ? null : <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

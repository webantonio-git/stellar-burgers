import { TOrder, TIngredient } from '@utils-types';

export type OrdersListUIProps = {
  orders?: TOrder[];
  orderByDate?: TOrder[];
};


export type TOrderInfo = TOrder & {
  ingredientsInfo: TIngredient[];     
  ingredientsToShow: TIngredient[];    
  remains: number;                    
  total: number;                       
  date: Date;                           
};

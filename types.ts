
export enum AppState {
  WELCOME = 'WELCOME',
  ORDERING = 'ORDERING',
  PAYING = 'PAYING',
  COMPLETED = 'COMPLETED'
}

export type DietaryPreference = 'VEG' | 'NON_VEG';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary: DietaryPreference;
  image: string;
  calories?: number;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type Category = 'Starters' | 'Biryanis' | 'Curries' | 'Breads' | 'Rice' | 'Drinks' | 'Desserts';

export interface TableStatus {
  tableId: number;
  state: AppState;
}

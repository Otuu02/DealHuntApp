export interface User {
  email: string;
  name: string;
  password?: string;
}

export type Marketplace = 'Gadget World' | 'Home Essentials' | 'Fashion Hub';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  currentPrice: number;
  oldPrice?: number;
  marketplace: Marketplace;
  productUrl: string;
}

export interface Alert {
  id: string;
  productId: string;
  title: string;
  image: string;
  currentPrice: number;
  targetPrice: number;
  createdAt: string;
  notified?: boolean;
}

export type Screen = 'Home' | 'Search' | 'Alerts' | 'Settings';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

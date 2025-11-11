export interface User {
  email: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  currentPrice: number;
  oldPrice?: number;
  marketplace: string;
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
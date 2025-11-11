import { Product } from '../types';

// --- Marketplace Data ---

const gadgetWorldProducts: Product[] = [
  {
    id: 'gw_001',
    title: 'Wireless Noise Cancelling Headphones',
    description: 'Immerse yourself in music with these high-fidelity wireless headphones. Features active noise cancellation and a 30-hour battery life.',
    image: 'https://picsum.photos/seed/headphones/600/400',
    currentPrice: 85000,
    oldPrice: 110000,
    marketplace: 'Gadget World',
    productUrl: '#',
  },
  {
    id: 'gw_002',
    title: '4K Smart TV 55-inch',
    description: 'Experience crystal-clear picture quality with this 55-inch 4K Smart TV. Access all your favorite streaming apps with ease.',
    image: 'https://picsum.photos/seed/smarttv/600/400',
    currentPrice: 320000,
    oldPrice: 350000,
    marketplace: 'Gadget World',
    productUrl: '#',
  },
  {
    id: 'gw_003',
    title: 'Smartwatch with Fitness Tracker',
    description: 'Monitor your health and stay connected with this feature-packed smartwatch. Tracks steps, heart rate, and sleep.',
    image: 'https://picsum.photos/seed/smartwatch/600/400',
    currentPrice: 75000,
    oldPrice: 90000,
    marketplace: 'Gadget World',
    productUrl: '#',
  },
   {
    id: 'gw_004',
    title: 'Portable Bluetooth Speaker',
    description: 'Take your music anywhere with this waterproof and durable Bluetooth speaker. Delivers powerful sound in a compact size.',
    image: 'https://picsum.photos/seed/speaker/600/400',
    currentPrice: 25000,
    marketplace: 'Gadget World',
    productUrl: '#',
  },
];

const homeEssentialsProducts: Product[] = [
  {
    id: 'he_001',
    title: 'Robotic Vacuum Cleaner',
    description: 'Keep your floors spotless with this intelligent robotic vacuum. Features smart mapping and self-charging capabilities.',
    image: 'https://picsum.photos/seed/vacuum/600/400',
    currentPrice: 150000,
    marketplace: 'Home Essentials',
    productUrl: '#',
  },
  {
    id: 'he_002',
    title: 'Espresso Coffee Machine',
    description: 'Become your own barista with this professional-grade espresso machine. Brews perfect coffee every time.',
    image: 'https://picsum.photos/seed/coffee/600/400',
    currentPrice: 65000,
    oldPrice: 72000,
    marketplace: 'Home Essentials',
    productUrl: '#',
  },
  {
    id: 'he_003',
    title: 'Air Fryer XL',
    description: 'Enjoy your favorite fried foods with up to 75% less fat. The extra-large capacity is perfect for families.',
    image: 'https://picsum.photos/seed/airfryer/600/400',
    currentPrice: 48000,
    oldPrice: 55000,
    marketplace: 'Home Essentials',
    productUrl: '#',
  },
  {
    id: 'he_004',
    title: 'Ergonomic Office Chair',
    description: 'Upgrade your home office with this comfortable and supportive ergonomic chair. Features adjustable lumbar support and armrests.',
    image: 'https://picsum.photos/seed/chair/600/400',
    currentPrice: 95000,
    marketplace: 'Home Essentials',
    productUrl: '#',
  },
];

const fashionHubProducts: Product[] = [
    {
        id: 'fh_001',
        title: 'Classic Leather Jacket',
        description: 'A timeless leather jacket that adds a touch of cool to any outfit. Made from 100% genuine leather.',
        image: 'https://picsum.photos/seed/jacket/600/400',
        currentPrice: 45000,
        oldPrice: 60000,
        marketplace: 'Fashion Hub',
        productUrl: '#',
    },
    {
        id: 'fh_002',
        title: 'Modern Running Sneakers',
        description: 'Lightweight and comfortable, these sneakers are perfect for your daily run or a casual day out.',
        image: 'https://picsum.photos/seed/sneakers/600/400',
        currentPrice: 32000,
        marketplace: 'Fashion Hub',
        productUrl: '#',
    },
];


const allMockProducts = [...gadgetWorldProducts, ...homeEssentialsProducts, ...fashionHubProducts];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export const getDeals = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return shuffleArray([...allMockProducts]);
};

export const fetchUpdatedPrices = async (productIds: string[]): Promise<Record<string, number>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedPrices: Record<string, number> = {};
    const productsToUpdate = allMockProducts.filter(p => productIds.includes(p.id));

    productsToUpdate.forEach(product => {
        // Simulate a small chance of a price drop to test notifications
        const shouldPriceDrop = Math.random() > 0.8; 
        if (shouldPriceDrop) {
            // Drop price by 1-5%
            const priceDropFactor = 1 - (Math.random() * 0.04 + 0.01);
            updatedPrices[product.id] = Math.round(product.currentPrice * priceDropFactor);
        } else {
            updatedPrices[product.id] = product.currentPrice;
        }
    });

    return updatedPrices;
}
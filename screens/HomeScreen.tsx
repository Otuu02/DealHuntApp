
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getDeals } from '../services/productService';
import ProductCard from '../components/ProductCard';

interface HomeScreenProps {
  onProductSelect: (product: Product) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      const deals = await getDeals();
      setProducts(deals);
      setLoading(false);
    };
    fetchDeals();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily Deals</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
   
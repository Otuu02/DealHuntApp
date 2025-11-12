import React, { useState, useEffect, useMemo } from 'react';
import { Product, Marketplace } from '../types';
import { getAllProducts, getMarketplaces } from '../productService';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

interface HomeScreenProps {
  onProductSelect: (product: Product) => void;
}

const marketplaces: ('All' | Marketplace)[] = ['All', ...getMarketplaces()];

const HomeScreen: React.FC<HomeScreenProps> = ({ onProductSelect }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | Marketplace>('All');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      // Fetch all products and shuffle them for a dynamic "deals" feel
      const deals = await getAllProducts(true);
      setAllProducts(deals);
      setLoading(false);
    };
    fetchDeals();
  }, []);
  
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') {
      return allProducts;
    }
    return allProducts.filter(p => p.marketplace === activeFilter);
  }, [allProducts, activeFilter]);

  return (
    <div className="py-8 fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Deals</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {marketplaces.map((marketplace) => (
            <button
              key={marketplace}
              onClick={() => setActiveFilter(marketplace)}
              className={`${
                activeFilter === marketplace
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {marketplace}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
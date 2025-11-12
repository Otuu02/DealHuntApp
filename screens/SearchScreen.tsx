import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { getAllProducts } from '../productService';
import ProductCard from '../components/ProductCard';
import { SearchIcon } from '../components/icons/Icons';
import SkeletonLoader from '../components/SkeletonLoader';

interface SearchScreenProps {
  onProductSelect: (product: Product) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onProductSelect }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const deals = await getAllProducts();
      setAllProducts(deals);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      // Show all products if search is empty, so user can browse
      return allProducts;
    }
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProducts]);

  return (
    <div className="py-8 fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Products</h1>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for laptops, headphones, chairs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      ) : (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
              <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-semibold text-gray-700">No products found for "{searchTerm}"</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search term or check your spelling.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchScreen;
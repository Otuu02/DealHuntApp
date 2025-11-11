import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)
    : 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col"
      onClick={() => onSelect(product)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-48 object-cover" 
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{product.marketplace}</p>
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow">{product.title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-bold text-blue-600">₦{product.currentPrice.toLocaleString()}</p>
          {product.oldPrice && (
            <p className="ml-2 text-sm text-gray-500 line-through">₦{product.oldPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import { Product, User } from '../types';
import { saveAlertForUser } from '../services/storage';

interface DealDetailsModalProps {
  product: Product;
  onClose: () => void;
  currentUser: User | null;
  onAlertSet: () => void;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ product, onClose, currentUser, onAlertSet }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)
    : 0;

  const handleSetAlert = async () => {
    if (!currentUser || !targetPrice || isNaN(Number(targetPrice)) || Number(targetPrice) <= 0) return;
    
    setIsSaving(true);
    
    const newAlert = {
      id: `${product.id}-${new Date().getTime()}`,
      productId: product.id,
      title: product.title,
      image: product.image,
      currentPrice: product.currentPrice,
      targetPrice: Number(targetPrice),
      createdAt: new Date().toISOString(),
    };

    await saveAlertForUser(currentUser.email, newAlert);
    
    setIsSaving(false);
    onAlertSet();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          <div className="relative">
            <img src={product.image} alt={product.title} className="w-full h-auto rounded-lg object-contain max-h-80" />
            {discountPercentage > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Sold by: <span className="font-semibold text-gray-700">{product.marketplace}</span></p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <div className="my-4">
              <span className="text-4xl font-bold text-blue-600">₦{product.currentPrice.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="ml-3 text-lg text-gray-500 line-through">₦{product.oldPrice.toLocaleString()}</span>
              )}
            </div>
            
            <a 
              href={product.productUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block w-full text-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition-colors"
            >
              View on {product.marketplace}
            </a>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">Set Price Alert</h3>
              <p className="text-sm text-gray-500 mt-1">Get notified when the price drops!</p>
              
              <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                    <input 
                        type="number"
                        min="1"
                        placeholder={`e.g., ${Math.round(product.currentPrice * 0.9)}`}
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                  onClick={handleSetAlert}
                  disabled={isSaving || !targetPrice || Number(targetPrice) <= 0}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Set Alert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;

import React from 'react';
import { Alert } from '../types';
import { CheckCircleIcon, TargetIcon } from './icons/Icons';

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const isTargetMet = alert.currentPrice <= alert.targetPrice;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex items-center p-4 space-x-4">
      <img src={alert.image} alt={alert.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-gray-800 truncate">{alert.title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm">
            <div className="flex items-center text-gray-600">
                <p>Current: <span className="font-bold text-blue-600">₦{alert.currentPrice.toLocaleString()}</span></p>
            </div>
            <div className="flex items-center text-gray-600 mt-1 sm:mt-0">
                <TargetIcon className="w-4 h-4 mr-1 text-gray-400"/>
                <p>Target: <span className="font-bold text-gray-800">₦{alert.targetPrice.toLocaleString()}</span></p>
            </div>
        </div>
      </div>
      {isTargetMet && (
          <div className="flex flex-col items-center text-green-500 ml-4 flex-shrink-0">
            <CheckCircleIcon className="w-6 h-6"/>
            <span className="text-xs font-medium mt-1">Target Met!</span>
          </div>
        )}
    </div>
  );
};

export default AlertCard;
   
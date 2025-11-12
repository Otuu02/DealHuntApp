import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="animate-pulse flex flex-col h-full">
        <div className="bg-gray-200 h-48 w-full"></div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="mt-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
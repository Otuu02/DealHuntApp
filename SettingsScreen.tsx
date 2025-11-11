
import React, { useState } from 'react';
import { User } from '../types';
import { clearAlertsForCurrentUser } from '../services/storage';

interface SettingsScreenProps {
  currentUser: User | null;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentUser }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClearAlerts = async () => {
    if (currentUser) {
      await clearAlertsForCurrentUser(currentUser.email);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
        {currentUser ? (
          <div className="space-y-2">
            <p><span className="font-medium text-gray-600">Name:</span> {currentUser.name}</p>
            <p><span className="font-medium text-gray-600">Email:</span> {currentUser.email}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading user data...</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Data</h2>
        <p className="text-sm text-gray-500 mb-4">This will permanently remove all of your saved price alerts.</p>
        <button 
          onClick={handleClearAlerts}
          className="w-full sm:w-auto bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear All Price Alerts
        </button>
        {showConfirmation && (
          <p className="mt-4 text-green-600 font-medium">Alerts cleared successfully!</p>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
          <p>DealHunt Web v1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
   
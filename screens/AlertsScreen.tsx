import React, { useState, useEffect, useCallback } from 'react';
import { Alert, User } from '../types';
import { loadAlertsForCurrentUser } from '../services/storage';
import AlertCard from '../components/AlertCard';
import { BellIcon } from '../components/icons/Icons';

interface AlertsScreenProps {
  currentUser: User | null;
  onAlertsUpdate: () => void;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ currentUser, onAlertsUpdate }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      const userAlerts = await loadAlertsForCurrentUser(currentUser.email);
      setAlerts(userAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
      onAlertsUpdate();
    }
  }, [currentUser, onAlertsUpdate]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <div className="py-8 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Price Alerts</h1>
        <button 
          onClick={fetchAlerts} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading alerts...</p>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400"/>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">No alerts yet.</h2>
          <p className="text-gray-500 mt-2">Find a product and set an alert to start tracking prices!</p>
        </div>
      )}
    </div>
  );
};

export default AlertsScreen;
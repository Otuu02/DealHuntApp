
import React, { useState, useEffect, useCallback } from 'react';
import { User, Product, Alert, Screen } from './types';
import { getCurrentUser, saveCurrentUser } from './services/storage';
import { usePriceChecker } from './hooks/usePriceChecker';

import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import AlertsScreen from './screens/AlertsScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import DealDetailsModal from './components/DealDetailsModal';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    let user = getCurrentUser();
    if (!user) {
      user = { email: 'guest@dealhunt.web', name: 'Guest' };
      saveCurrentUser(user);
    }
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  usePriceChecker(currentUser, notificationPermission);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen onProductSelect={handleProductSelect} />;
      case 'Search':
        return <SearchScreen onProductSelect={handleProductSelect} />;
      case 'Alerts':
        return <AlertsScreen currentUser={currentUser} />;
      case 'Settings':
        return <SettingsScreen currentUser={currentUser} />;
      default:
        return <HomeScreen onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <main className="pb-24 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {renderScreen()}
        </div>
      </main>
      {selectedProduct && (
        <DealDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default App;
   
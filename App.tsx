import React, { useState, useEffect, useCallback } from 'react';
import { User, Product, Screen, ToastMessage } from './types';
import { getLoggedInUser, saveLoggedInUser, logoutUser, loadAlertsForCurrentUser } from './services/storage';
import { usePriceChecker } from './hooks/usePriceChecker';

import AppLayout from './components/AppLayout';
import HomeScreen from './screens/HomeScreen';
import AlertsScreen from './screens/AlertsScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './SettingsScreen';
import DealDetailsModal from './components/DealDetailsModal';
import Toast from './components/Toast';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  const fetchAlertCount = useCallback(async (user: User) => {
    const alerts = await loadAlertsForCurrentUser(user.email);
    const unnotifiedCount = alerts.filter(a => !a.notified).length;
    setAlertCount(unnotifiedCount);
  }, []);

  useEffect(() => {
    const user = getLoggedInUser();
    if (user) {
      setCurrentUser(user);
      fetchAlertCount(user);
    }
    setIsLoading(false);
  }, [fetchAlertCount]);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  const onPriceCheckUpdate = useCallback(() => {
    if (currentUser) {
      fetchAlertCount(currentUser);
    }
  }, [currentUser, fetchAlertCount]);

  usePriceChecker(currentUser, notificationPermission, onPriceCheckUpdate);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  
  const handleAlertSet = useCallback(() => {
    if(currentUser) fetchAlertCount(currentUser);
    showToast('Price alert has been set!', 'success');
  }, [currentUser, fetchAlertCount, showToast]);

  const handleLoginSuccess = (user: User) => {
    saveLoggedInUser(user);
    setCurrentUser(user);
    fetchAlertCount(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveScreen('Home'); // Reset screen on logout
    setAlertCount(0);
    showToast('You have been logged out.', 'success');
  };

  const handleAlertsUpdate = useCallback(() => {
    if (currentUser) {
        fetchAlertCount(currentUser);
    } else {
        setAlertCount(0);
    }
  }, [currentUser, fetchAlertCount]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen onProductSelect={handleProductSelect} />;
      case 'Search':
        return <SearchScreen onProductSelect={handleProductSelect} />;
      case 'Alerts':
        return <AlertsScreen currentUser={currentUser} onAlertsUpdate={handleAlertsUpdate} />;
      case 'Settings':
        return <SettingsScreen currentUser={currentUser} onAlertsUpdate={handleAlertsUpdate} onLogout={handleLogout} />;
      default:
        return <HomeScreen onProductSelect={handleProductSelect} />;
    }
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Loading DealHunt...</p></div>;
  }

  if (!currentUser) {
    if (authScreen === 'login') {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuthScreen('signup')} />;
    }
    return <SignUpScreen onSignUpSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthScreen('login')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <AppLayout 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen}
        alertCount={alertCount}
      >
        {renderScreen()}
      </AppLayout>
      
      {selectedProduct && (
        <DealDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          currentUser={currentUser}
          onAlertSet={handleAlertSet}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;

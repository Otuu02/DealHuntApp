import { useEffect, useRef } from 'react';
import { User, Alert } from '../types';
import { loadAlertsForCurrentUser, saveAlertsForCurrentUser } from '../services/storage';
import { fetchUpdatedPrices } from '../productService';

const CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const usePriceChecker = (
    currentUser: User | null, 
    notificationPermission: NotificationPermission,
    onUpdate: () => void,
) => {
  const isChecking = useRef(false);

  useEffect(() => {
    const checkPrices = async () => {
      if (!currentUser || isChecking.current) {
        return;
      }
      
      isChecking.current = true;
      try {
        const alerts = await loadAlertsForCurrentUser(currentUser.email);
        const unnotifiedAlerts = alerts.filter(a => !a.notified);
        
        if (unnotifiedAlerts.length === 0) {
          return;
        }

        const productIds = unnotifiedAlerts.map(alert => alert.productId);
        const updatedPrices = await fetchUpdatedPrices(productIds);
        
        let alertsUpdated = false;
        let notificationTriggered = false;
        const newAlertsState = [...alerts];

        for (const alert of newAlertsState) {
          const newPrice = updatedPrices[alert.productId];

          // Update current price if it has changed
          if (newPrice !== undefined && newPrice !== alert.currentPrice) {
            alert.currentPrice = newPrice;
            alertsUpdated = true;
          }

          // Check for notification trigger
          if (!alert.notified && newPrice !== undefined && newPrice <= alert.targetPrice) {
            alert.notified = true;
            alertsUpdated = true;
            notificationTriggered = true;
            
            if (notificationPermission === 'granted') {
              new Notification('Price Alert Triggered!', {
                body: `${alert.title} is now ₦${newPrice.toLocaleString()} (your target: ₦${alert.targetPrice.toLocaleString()}).`,
                icon: alert.image,
              });
            }
          }
        }

        if (alertsUpdated) {
          await saveAlertsForCurrentUser(currentUser.email, newAlertsState);
          // If a notification was triggered, call the onUpdate callback to refresh UI
          if(notificationTriggered) {
            onUpdate();
          }
        }

      } catch (error) {
        console.error("Error during price check:", error);
      } finally {
        isChecking.current = false;
      }
    };

    if (currentUser) {
      // Run once on start
      checkPrices(); 
      const intervalId = setInterval(checkPrices, CHECK_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [currentUser, notificationPermission, onUpdate]);
};

import { User, Alert } from '../types';
import { STORAGE_KEYS } from '../constants';

// --- User Management ---

export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save current user:", error);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

// --- Alert Management ---

type AllAlertsStore = {
  [email: string]: Alert[];
};

const loadAllAlerts = (): AllAlertsStore => {
  try {
    const alertsJson = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!alertsJson) return {};
    const parsed = JSON.parse(alertsJson);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.error("Failed to load all alerts, returning empty object:", error);
    // If data is corrupted, clear it to prevent future errors
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    return {};
  }
};

const saveAllAlerts = (allAlerts: AllAlertsStore): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(allAlerts));
  } catch (error) {
    console.error("Failed to save all alerts:", error);
  }
};

export const loadAlertsForCurrentUser = async (email: string): Promise<Alert[]> => {
  return Promise.resolve(loadAllAlerts()[email] || []);
};

export const saveAlertsForCurrentUser = async (email: string, alerts: Alert[]): Promise<void> => {
  const allAlerts = loadAllAlerts();
  allAlerts[email] = alerts;
  saveAllAlerts(allAlerts);
  return Promise.resolve();
}

export const saveAlertForUser = async (email: string, newAlert: Alert): Promise<void> => {
  const allAlerts = loadAllAlerts();
  const userAlerts = allAlerts[email] || [];
  // Avoid duplicates
  if (!userAlerts.some(alert => alert.productId === newAlert.productId)) {
    userAlerts.push(newAlert);
    allAlerts[email] = userAlerts;
    saveAllAlerts(allAlerts);
  }
  return Promise.resolve();
};

export const clearAlertsForCurrentUser = async (email: string): Promise<void> => {
  const allAlerts = loadAllAlerts();
  delete allAlerts[email];
  saveAllAlerts(allAlerts);
  return Promise.resolve();
};
   
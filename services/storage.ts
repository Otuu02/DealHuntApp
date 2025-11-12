
import { User, Alert } from '../types';
import { STORAGE_KEYS } from '../constants';

// --- User DB Management ---

type UserDB = {
  [email: string]: User;
}

const loadAllUsers = (): UserDB => {
  try {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!usersJson) return {};
    return JSON.parse(usersJson);
  } catch (error) {
    console.error("Failed to load users:", error);
    return {};
  }
}

const saveAllUsers = (users: UserDB): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
}

export const registerUser = async (user: User): Promise<{success: boolean, message: string}> => {
  const allUsers = loadAllUsers();
  if (allUsers[user.email]) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  allUsers[user.email] = user;
  saveAllUsers(allUsers);
  return { success: true, message: 'User registered successfully.' };
}

export const loginUser = async (email: string, password_provided: string): Promise<User | null> => {
    const allUsers = loadAllUsers();
    const user = allUsers[email];
    if (user && user.password === password_provided) {
        return user;
    }
    return null;
}


// --- Logged-in User Session ---

export const saveLoggedInUser = (user: User): void => {
  try {
    // Don't save password in the session storage for security
    const userToSave = { email: user.email, name: user.name };
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(userToSave));
  } catch (error) {
    console.error("Failed to save current user:", error);
  }
};

export const getLoggedInUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

export const logoutUser = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
    } catch (error) {
        console.error("Failed to logout user:", error);
    }
}

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


import React from 'react';
import { Screen } from '../types';
import { HomeIcon, SearchIcon, BellIcon, CogIcon } from './icons/Icons';

interface HeaderProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const navItems: { screen: Screen, label: string, icon: React.ReactNode }[] = [
  { screen: 'Home', label: 'Deals', icon: <HomeIcon /> },
  { screen: 'Search', label: 'Search', icon: <SearchIcon /> },
  { screen: 'Alerts', label: 'Alerts', icon: <BellIcon /> },
  { screen: 'Settings', label: 'Settings', icon: <CogIcon /> },
];

const Header: React.FC<HeaderProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-gray-800">DealHunt</span>
          </div>
          
          <nav className="flex-1 md:flex-none">
            <ul className="flex justify-around md:justify-end md:space-x-8">
              {navItems.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                  <li key={item.screen}>
                    <button
                      onClick={() => setActiveScreen(item.screen)}
                      className={`flex flex-col items-center justify-center space-y-1 w-16 md:flex-row md:space-y-0 md:space-x-2 md:w-auto transition-colors duration-200 ${
                        isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      {item.icon}
                      <span className="text-xs md:text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
   
import React from 'react';
import Header from './Header';
import { Screen } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  alertCount: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeScreen, setActiveScreen, alertCount }) => {
  return (
    <>
      <Header 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        alertCount={alertCount}
      />
      <main className="pb-24 pt-4 md:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export default AppLayout;
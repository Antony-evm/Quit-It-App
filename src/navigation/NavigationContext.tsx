import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationReadyContextType {
  isReady: boolean;
  setReady: () => void;
}

const NavigationReadyContext = createContext<NavigationReadyContextType | null>(
  null,
);

export const useNavigationReady = () => {
  const context = useContext(NavigationReadyContext);
  if (!context) {
    // Return a default state instead of throwing an error
    console.warn(
      'useNavigationReady called outside of NavigationReadyProvider, returning default state',
    );
    return { isReady: false, setReady: () => {} };
  }
  return context;
};

interface NavigationReadyProviderProps {
  children: ReactNode;
}

export const NavigationReadyProvider: React.FC<
  NavigationReadyProviderProps
> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  const setReady = () => {
    console.log('[NavigationContext] Setting navigation as ready');
    setIsReady(true);
  };

  return (
    <NavigationReadyContext.Provider value={{ isReady, setReady }}>
      {children}
    </NavigationReadyContext.Provider>
  );
};

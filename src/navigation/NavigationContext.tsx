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
    setIsReady(true);
  };

  return (
    <NavigationReadyContext.Provider value={{ isReady, setReady }}>
      {children}
    </NavigationReadyContext.Provider>
  );
};

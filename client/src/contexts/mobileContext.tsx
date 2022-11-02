import React, { useState, createContext, ReactNode, useEffect } from "react";

export interface MobileContextInterface {
  isMobile: boolean | undefined,
  isLandscape: boolean,
}

export const MobileContext = createContext<MobileContextInterface | null>(null);

type ProviderProps = {
  children: ReactNode
}

export const MobileProvider = ({ children }: ProviderProps) => {

  const [isLandscape, setIsLandscape] = useState<boolean>(window.innerWidth > window.innerHeight);
  const [isMobile, setIsMobile] = useState<boolean>();

  const media = window.matchMedia('(orientation: landscape)');

  const getIsMobile = () => {
    const mobileMax = window.matchMedia('(max-width: 900px)').matches;
    const mobileMin = window.matchMedia('(min-width: 480px)').matches;
    return mobileMax && mobileMin;
  }

  useEffect(() => {
    setIsMobile(getIsMobile());

    const changeHandler = (e: MediaQueryListEvent) => {
      setIsLandscape(e.matches);
      const mobileMax = window.matchMedia('(max-width: 900px)').matches;
      const mobileMin = window.matchMedia('(min-width: 480px)').matches;
      setIsMobile(getIsMobile());
    }

    media.addEventListener('change', changeHandler);

    return () => {
      media.removeEventListener('change', changeHandler);
    }
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile, isLandscape }}>
      {children}
    </MobileContext.Provider>
  )
}

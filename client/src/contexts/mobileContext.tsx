import React, { useState, createContext, ReactNode, useEffect } from "react";

export interface MobileContextInterface {
  isMobilePortrait: boolean | undefined,
  isMobileLandscape: boolean | undefined,
  isLandscape: boolean,
}

export const MobileContext = createContext<MobileContextInterface | null>(null);

type ProviderProps = {
  children: ReactNode
}

export const MobileProvider = ({ children }: ProviderProps) => {

  const [isLandscape, setIsLandscape] = useState<boolean>(window.innerWidth > window.innerHeight);
  const [isMobilePortrait, setIsMobilePortrait] = useState<boolean>();
  const [isMobileLandscape, setIsMobileLandscape] = useState<boolean>();

  const media = window.matchMedia('(orientation: landscape)');

  const getIsMobilePortrait = () => {
    return window.matchMedia('(max-width: 420px)').matches;
  }

  const getIsMobileLandscape = () => {
    const mobileMax = window.matchMedia('(max-width: 900px)').matches;
    const mobileMin = window.matchMedia('(min-width: 480px)').matches;
    return mobileMax && mobileMin;
  }

  useEffect(() => {
    setIsMobilePortrait(getIsMobilePortrait());
    setIsMobileLandscape(getIsMobileLandscape());

    const changeHandler = (e: MediaQueryListEvent) => {
      setIsLandscape(e.matches);
      setIsMobileLandscape(getIsMobileLandscape());
      setIsMobilePortrait(getIsMobilePortrait());
    }

    media.addEventListener('change', changeHandler);

    return () => {
      media.removeEventListener('change', changeHandler);
    }
  }, []);

  return (
    <MobileContext.Provider
      value={{ isMobilePortrait, isMobileLandscape, isLandscape }}
    >
      {children}
    </MobileContext.Provider>
  )
}

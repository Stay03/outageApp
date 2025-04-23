import React, { createContext, useState, useEffect } from 'react';
import { getOnboardingStatus, saveOnboardingStatus } from '../utils/storage';

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check local storage on initial load
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      setIsLoading(true);
      const completed = await getOnboardingStatus();
      setHasCompletedOnboarding(completed);
      setIsLoading(false);
    };
    
    checkOnboardingStatus();
  }, []);
  
  const completeOnboarding = async () => {
    await saveOnboardingStatus(true);
    setHasCompletedOnboarding(true);
  };
  
  const skipOnboarding = async () => {
    await completeOnboarding();
  };
  
  const nextScreen = () => {
    setCurrentScreenIndex(prevIndex => prevIndex + 1);
  };
  
  const prevScreen = () => {
    setCurrentScreenIndex(prevIndex => Math.max(0, prevIndex - 1));
  };
  
  const resetOnboarding = async () => {
    await saveOnboardingStatus(false);
    setHasCompletedOnboarding(false);
    setCurrentScreenIndex(0);
  };
  
  return (
    <OnboardingContext.Provider 
      value={{ 
        hasCompletedOnboarding,
        isLoading,
        currentScreenIndex,
        setCurrentScreenIndex,
        completeOnboarding,
        skipOnboarding,
        nextScreen,
        prevScreen,
        resetOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
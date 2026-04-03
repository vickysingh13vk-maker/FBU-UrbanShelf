import React, { createContext, useContext, useState, useCallback } from 'react';
import { Customer } from '../types';

interface CheckInContextType {
  checkedInCustomer: Customer | null;
  checkIn: (customer: Customer) => Promise<boolean>;
  checkOut: () => void;
  isNear: (customer: Customer) => Promise<boolean>;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export const CheckInProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkedInCustomer, setCheckedInCustomer] = useState<Customer | null>(null);

  const isNear = useCallback(async (customer: Customer): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // Fallback for environments without geolocation
        resolve(true);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Simple distance calculation (Haversine or similar would be better for real use)
          // For demo purposes, we'll assume the customer has lat/lng or we mock it
          // If customer doesn't have lat/lng, we'll allow it for now
          if (!customer.lat || !customer.lng) {
            resolve(true);
            return;
          }

          const distance = Math.sqrt(
            Math.pow(latitude - customer.lat, 2) + 
            Math.pow(longitude - customer.lng, 2)
          );

          // Threshold for "near" (approx 200m in degrees)
          const threshold = 0.002; 
          resolve(distance < threshold);
        },
        () => {
          // If permission denied or error, allow for demo but log
          console.warn('Geolocation failed, allowing check-in for demo');
          resolve(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }, []);

  const checkIn = useCallback(async (customer: Customer): Promise<boolean> => {
    const near = await isNear(customer);
    if (near) {
      setCheckedInCustomer(customer);
      return true;
    }
    return false;
  }, [isNear]);

  const checkOut = useCallback(() => {
    setCheckedInCustomer(null);
  }, []);

  return (
    <CheckInContext.Provider value={{ checkedInCustomer, checkIn, checkOut, isNear }}>
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
};

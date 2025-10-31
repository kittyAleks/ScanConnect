import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './usePermissions';

export type LatLng = { latitude: number; longitude: number };

export interface UseLocationResult {
  location: LatLng | null;
  isLoading: boolean;
  error: boolean;
}

export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
  }, []);

  const getLocation = async () => {
    setIsLoading(true);
    setError(false);

    const granted = await requestLocationPermission();
    if (!granted) {
      setIsLoading(false);
      setError(true);
      return;
    }

    Geolocation.getCurrentPosition(
      (pos: any) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setIsLoading(false);
        setError(false);
      },
      (_err: any) => {
        setIsLoading(false);
        setError(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { location, isLoading, error };
};

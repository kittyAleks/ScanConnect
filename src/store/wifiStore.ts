import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WifiManager from 'react-native-wifi-reborn';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  requestLocationPermission,
  requestWiFiPermissions,
} from '../hooks/usePermissions';
import { useEventsStore } from './eventsStore';
type LatLng = { latitude: number; longitude: number };

type WifiNetwork = {
  SSID: string;
  BSSID?: string;
  level?: number;
  coord?: LatLng;
  scannedAt?: number;
};

type WifiStore = {
  networks: WifiNetwork[];
  loading: boolean;
  scanNetworks: () => Promise<void>;
};

export const useWifiStore = create<WifiStore>()(
  persist(
    (set, _get) => ({
      networks: [],
      loading: false,

      scanNetworks: async () => {
        const state = _get();
        if (state.loading) {
          return;
        }

        const { logEvent } = useEventsStore.getState();

        if (Platform.OS === 'ios') {
          logEvent('iOS Wi-Fi scan not supported', {
            platform: Platform.OS,
            date: new Date().toISOString(),
          });
          Alert.alert(
            'Not supported',
            'Wi-Fi scanning is not supported on iOS. This feature only works on Android devices.',
          );
          return;
        }
        if (Platform.OS !== 'android') {
          logEvent('Wi-Fi scan not supported', {
            platform: Platform.OS,
            date: new Date().toISOString(),
          });
          return;
        }

        const granted = await requestWiFiPermissions();
        if (!granted) {
          return;
        }

        logEvent('Start Wi-Fi scan', {
          name: 'Start Wi-Fi scan',
          date: new Date().toISOString(),
        });

        set({ loading: true });
        try {
          const hasRescan =
            typeof (WifiManager as any).reScanAndLoadWifiList === 'function';
          const hasLoad =
            typeof (WifiManager as any).loadWifiList === 'function';

          if (!hasRescan && !hasLoad) {
            throw new Error(
              'Wi‑Fi scan functions are not available on this platform/build',
            );
          }

          let results: any[] = [];
          try {
            if (hasRescan) {
              const res = await (WifiManager as any).reScanAndLoadWifiList();
              results = Array.isArray(res) ? res : [];
            } else if (hasLoad) {
              const res = await (WifiManager as any).loadWifiList();
              results = Array.isArray(res) ? res : [];
            }
          } catch (wifiError: any) {
            logEvent('Wi-Fi scan library error', {
              error: wifiError?.message || String(wifiError),
            });
            results = [];
          }

          let coord: LatLng | undefined;
          try {
            const hasLocationPermission =
              Platform.OS === 'android'
                ? await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  )
                : true;

            const locGranted = hasLocationPermission
              ? true
              : await requestLocationPermission();

            if (locGranted) {
              coord = await new Promise<LatLng | undefined>(resolve => {
                let resolved = false;
                Geolocation.getCurrentPosition(
                  (pos: any) => {
                    if (!resolved) {
                      resolved = true;
                      resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                      });
                    }
                  },
                  (_err: any) => {
                    Geolocation.getCurrentPosition(
                      (pos2: any) => {
                        if (!resolved) {
                          resolved = true;
                          resolve({
                            latitude: pos2.coords.latitude,
                            longitude: pos2.coords.longitude,
                          });
                        }
                      },
                      (_err2: any) => {
                        if (!resolved) {
                          resolved = true;
                          resolve(undefined);
                        }
                      },
                      {
                        enableHighAccuracy: false,
                        timeout: 15000,
                        maximumAge: 60000,
                      },
                    );
                  },
                  { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
                );
              });
            }
          } catch (locError: any) {
            logEvent('Location error during Wi-Fi scan', {
              error: locError?.message || String(locError),
            });
            coord = undefined;
          }

          const scannedAt = Date.now();
          const withCoords = results.map(item => ({
            ...item,
            coord,
            scannedAt,
          }));

          const withCoordCount = withCoords.filter(n => !!n.coord).length;
          logEvent('Wi-Fi scan results', {
            total: withCoords.length,
            withCoords: withCoordCount,
            coordAttached: Boolean(coord),
            coord,
            scannedAt,
          });

          set({ networks: withCoords, loading: false });
        } catch (error: any) {
          logEvent('Wi-Fi scan crash', {
            error: error?.message || String(error),
            stack: error?.stack,
            name: error?.name,
          });
          set({ loading: false, networks: [] });
        }
      },
    }),
    {
      name: 'wifi-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ networks: state.networks }),
    },
  ),
);

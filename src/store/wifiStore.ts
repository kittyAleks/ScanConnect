import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WifiManager from 'react-native-wifi-reborn';
import { Platform, Alert } from 'react-native';
import { useEventsStore } from './eventsStore';
import { requestWiFiPermissions } from '../hooks/usePermissions';

type WifiNetwork = {
  SSID: string;
  BSSID?: string;
  level?: number;
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
          if (hasRescan) {
            const res = await (WifiManager as any).reScanAndLoadWifiList();
            results = res;
          } else if (hasLoad) {
            const res = await (WifiManager as any).loadWifiList();
            results = res;
          }
          set({ networks: results, loading: false });
        } catch {
          set({ loading: false });
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

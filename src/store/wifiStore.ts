import { create } from 'zustand';
import WifiManager from 'react-native-wifi-reborn';
import { PermissionsAndroid, Platform } from 'react-native';
import { useEventsStore } from './eventsStore';

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

export const useWifiStore = create<WifiStore>((set, _get) => ({
  networks: [],
  loading: false,

  scanNetworks: async () => {
    const { logEvent } = useEventsStore.getState();
    // const { addEvent } = useEventsStore.getState();

    if (Platform.OS === 'ios') {
      console.log('Wi-Fi scan not supported on iOS');
      return;
    }
    if (Platform.OS !== 'android') {
      logEvent('Wi-Fi scan not supported on iOS', {
        platform: Platform.OS,
        date: new Date().toISOString(),
      });
      return;
    }
    console.log('[WiFi] Platform', Platform.OS, 'SDK', Platform.Version);
    const requests: Array<Promise<string>> = [];
    requests.push(
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission',
          message: 'Location is required to scan nearby Wi‑Fi networks.',
          buttonPositive: 'OK',
        },
      ),
    );
    if (
      Platform.Version >= 33 &&
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
    ) {
      requests.push(
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
          {
            title: 'Nearby Wi‑Fi permission',
            message: 'Nearby Wi‑Fi permission is required on Android 13+.',
            buttonPositive: 'OK',
          },
        ),
      );
    }
    const resultsPerm = await Promise.all(requests);
    console.log('resultsPerm', resultsPerm);
    const granted = resultsPerm.includes(PermissionsAndroid.RESULTS.GRANTED);
    if (!granted) {
      console.warn('Wi‑Fi scan permissions not granted');
      return;
    }

    // ✅ 3. Добавляем событие
    logEvent('Запуск поиска Wi-Fi точек', {
      name: 'Запуск поиска Wi-Fi точек',
      date: new Date().toISOString(),
    });

    // ✅ 4. Загружаем список сетей (если методы доступны)
    set({ loading: true });
    try {
      // В некоторых версиях требуется инициировать рескан
      const hasRescan =
        typeof (WifiManager as any).reScanAndLoadWifiList === 'function';
      const hasLoad = typeof (WifiManager as any).loadWifiList === 'function';

      if (!hasRescan && !hasLoad) {
        throw new Error(
          'Wi‑Fi scan functions are not available on this platform/build',
        );
      }

      console.log('[WiFi] hasRescan', hasRescan, 'hasLoad', hasLoad);

      let results: any[] = [];
      if (hasRescan) {
        const res = await (WifiManager as any).reScanAndLoadWifiList();
        console.log(
          '[WiFi] reScanAndLoadWifiList length',
          res?.length,
          'sample',
          Array.isArray(res) ? res.slice(0, 3) : res,
        );
        results = res;
      } else if (hasLoad) {
        const res = await (WifiManager as any).loadWifiList();
        console.log(
          '[WiFi] loadWifiList length',
          res?.length,
          'sample',
          Array.isArray(res) ? res.slice(0, 3) : res,
        );
        results = res;
      }
      if (__DEV__ && (!results || results.length === 0)) {
        results = Array.from({ length: 6 }).map((_, i) => ({
          SSID: `EMU-NET-${i + 1}`,
          BSSID: `00:00:00:00:00:${(i + 1).toString().padStart(2, '0')}`,
          level: -40 - i * 5,
        }));
      }
      console.log('[WiFi] final results length', results?.length);
      set({ networks: results, loading: false });
    } catch (error) {
      console.error('Ошибка при сканировании Wi‑Fi:', error);
      set({ loading: false });
    }
  },
}));

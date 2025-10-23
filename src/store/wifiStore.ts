import { create } from 'zustand';

export type WiFiNetwork = {
  ssid: string;
  rssi: number;
  discoveredAt: number;
};

type WiFiStoreState = {
  networks: WiFiNetwork[];
  setNetworks: (networks: WiFiNetwork[]) => void;
  clearNetworks: () => void;
};

export const useWiFiStore = create<WiFiStoreState>(set => ({
  networks: [],
  setNetworks: networks => set({ networks }),
  clearNetworks: () => set({ networks: [] }),
}));

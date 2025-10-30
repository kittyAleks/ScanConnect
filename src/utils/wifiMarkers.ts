export type LatLng = { latitude: number; longitude: number };

export type WifiNetworkWithCoord = {
  SSID?: string;
  coord?: LatLng;
};

export type WifiMarker = {
  ssid: string;
  coord: LatLng;
  key: string;
};

export function buildWifiMarkers(
  networks: WifiNetworkWithCoord[],
  radius = 0.00025,
): WifiMarker[] {
  const list = networks.filter(n => !!n.coord);
  if (!list.length) return [];

  return list.map((n, i) => {
    const base = n.coord as LatLng;
    const angle = (2 * Math.PI * i) / list.length;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    return {
      ssid: n.SSID ?? `Wi-Fi ${i + 1}`,
      coord: { latitude: base.latitude + dy, longitude: base.longitude + dx },
      key: `wifi-${i}-${n.SSID || 'unknown'}`,
    };
  });
}

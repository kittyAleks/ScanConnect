import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'ScanConnect needs access to your location to show your position on the map.',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const requestWiFiPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

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

  const results = await Promise.all(requests);
  return results.includes(PermissionsAndroid.RESULTS.GRANTED);
};

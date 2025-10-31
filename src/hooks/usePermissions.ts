import { PermissionsAndroid, Platform } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'ScanConnect needs access to your camera to scan codes',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  }
  return true;
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const checkResult = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (checkResult) {
      return true;
    }

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

  const hasLocation = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (!hasLocation) {
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
  } else {
    requests.push(Promise.resolve(PermissionsAndroid.RESULTS.GRANTED));
  }

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

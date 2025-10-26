import React, { forwardRef, useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { styles } from './styles';
import { FakeCameraPlaceholder } from '../../shared/FakeCameraPlaceholder';

export const CameraView = forwardRef(({ onCodeScanned }: any, ref: any) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
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
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn('Camera permission error:', err);
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
    }
  };

  if (!hasPermission) {
    return <FakeCameraPlaceholder onFakeScan={onCodeScanned} />;
  }

  return (
    <Camera
      ref={ref}
      style={styles.camera}
      scanBarcode
      showFrame
      onReadCode={(event: any) => {
        const value = event?.nativeEvent?.codeStringValue;
        if (value) onCodeScanned(value);
      }}
      frameColor="#ffffff"
      laserColor="#ff0000"
    />
  );
});

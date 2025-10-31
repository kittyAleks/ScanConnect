import React, { forwardRef, useEffect, useState } from 'react';
import { Camera } from 'react-native-camera-kit';
import { styles } from './styles';
import { FakeCameraPlaceholder } from '../../shared/FakeCameraPlaceholder';
import { requestCameraPermission } from '../../hooks/usePermissions';

export const CameraView = forwardRef(({ onCodeScanned }: any, ref: any) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    }
    checkPermission();
  }, []);

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
        if (value) {
          onCodeScanned(value);
        }
      }}
      frameColor="#ffffff"
      laserColor="#ff0000"
    />
  );
});

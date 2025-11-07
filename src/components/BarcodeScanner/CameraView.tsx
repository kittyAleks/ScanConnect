import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { Camera } from 'react-native-camera-kit';
import { styles } from './styles';
import { FakeCameraPlaceholder } from '../../shared/FakeCameraPlaceholder';
import { requestCameraPermission } from '../../hooks/usePermissions';

export const CameraView = forwardRef(
  ({ onCodeScanned, cameraKey }: any, ref: any) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [permissionKey, setPermissionKey] = useState(0);
    const onCodeScannedRef = useRef(onCodeScanned);
    const prevPermissionRef = useRef(false);

    useEffect(() => {
      onCodeScannedRef.current = onCodeScanned;
    }, [onCodeScanned]);

    useEffect(() => {
      async function checkPermission() {
        const granted = await requestCameraPermission();
        const prevPermission = prevPermissionRef.current;
        prevPermissionRef.current = granted;
        setHasPermission(granted);
        if (granted && !prevPermission) {
          setPermissionKey(k => k + 1);
        }
      }
      checkPermission();
    }, []);

    if (!hasPermission) {
      return <FakeCameraPlaceholder onFakeScan={onCodeScanned} />;
    }

    return (
      <Camera
        key={`camera-inner-${cameraKey}-${permissionKey}`}
        ref={ref}
        style={styles.camera}
        scanBarcode
        showFrame
        onReadCode={(event: any) => {
          const value = event?.nativeEvent?.codeStringValue;
          if (value && onCodeScannedRef.current) {
            onCodeScannedRef.current(value);
          }
        }}
        frameColor="#ffffff"
        laserColor="#ff0000"
      />
    );
  },
);

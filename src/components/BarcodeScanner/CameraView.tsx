import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { styles } from './styles';
import { FakeCameraPlaceholder } from '../../shared/FakeCameraPlaceholder';

export const CameraView = forwardRef(({ onCodeScanned }: any, ref: any) => {
  if (Platform.OS === 'ios' && !__DEV__) {
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
  }

  return <FakeCameraPlaceholder onFakeScan={onCodeScanned} />;
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const FakeCameraPlaceholder = ({
  onFakeScan,
}: {
  onFakeScan: (value: string) => void;
}) => {
  const handleFakeScan = () => {
    const fakeCode = `FAKE-${Math.floor(Math.random() * 1000)}`;
    onFakeScan(fakeCode);
  };

  return (
    <View style={[styles.camera, styles.fakeCamera]}>
      <Text style={styles.fakeText}>Camera not available in Simulator</Text>
      <TouchableOpacity style={styles.fakeButton} onPress={handleFakeScan}>
        <Text style={styles.fakeButtonText}>Fake Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: { height: 260, width: '100%' },
  fakeCamera: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeText: { color: '#555', marginBottom: 12 },
  fakeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fakeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

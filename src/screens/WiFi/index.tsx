import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const WiFi = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wi-Fi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});

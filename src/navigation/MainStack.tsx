import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BarcodeScanner, Events, Home, WiFi, Map } from '../screens';

export const MainStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      <Stack.Screen name="WiFi" component={WiFi} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

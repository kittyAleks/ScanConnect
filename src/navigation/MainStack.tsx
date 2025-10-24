import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Events, Home, WiFi, Map, BarcodeScannerScreen } from '../screens';

export const MainStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BarcodeScannerScreen"
        component={BarcodeScannerScreen}
      />
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="WiFi" component={WiFi} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabs } from './BottomTabs';

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

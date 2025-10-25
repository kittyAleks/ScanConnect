import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarcodeScannerScreen, WiFi, Events, Map, Home } from '../screens';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={BarcodeScannerScreen}
        options={{
          tabBarLabel: 'Scanner',
        }}
      />

      <Tab.Screen
        name="WiFi"
        component={WiFi}
        options={{
          tabBarLabel: 'WiFi',
        }}
      />

      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: 'Map',
        }}
      />

      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarLabel: 'Events',
        }}
      />
    </Tab.Navigator>
  );
};

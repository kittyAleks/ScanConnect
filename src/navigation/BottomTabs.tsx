import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarcodeScannerScreen, WiFi, Events, Map } from '../screens';
import { Platform, Text } from 'react-native';
export type IconProps = {
  color: string;
  glyph: string;
};
const Icon = ({ color, glyph }: IconProps) => (
  <Text style={{ color, fontSize: 25 }}>{glyph}</Text>
);

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
        name="Scanner"
        component={BarcodeScannerScreen}
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color }) => <Icon color={color} glyph="▦" />,
        }}
      />

      <Tab.Screen
        name="WiFi"
        component={WiFi}
        options={{
          tabBarLabel: 'WiFi',
          tabBarIcon: ({ color }) => <Icon color={color} glyph="≋" />,
        }}
      />

      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => <Icon color={color} glyph="⌖" />,
        }}
      />

      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => <Icon color={color} glyph="✎" />,
        }}
      />
    </Tab.Navigator>
  );
};

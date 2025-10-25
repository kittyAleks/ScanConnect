import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useWifiStore } from '../../store/wifiStore';
import { useEventsStore } from '../../store/eventsStore';

type LatLng = { latitude: number; longitude: number };

function generateNearbyCoords(center: LatLng, count: number): LatLng[] {
  const res: LatLng[] = [];
  for (let i = 0; i < count; i++) {
    const dx = (Math.random() - 0.5) * 0.001; // ~100м
    const dy = (Math.random() - 0.5) * 0.001;
    res.push({
      latitude: center.latitude + dy,
      longitude: center.longitude + dx,
    });
  }
  return res;
}

export const Map = () => {
  const { networks } = useWifiStore();
  const { logEvent } = useEventsStore();
  const [current, setCurrent] = useState<LatLng | null>(null);

  useEffect(() => {
    logEvent('Display map');
  }, [logEvent]);

  useEffect(() => {
    async function requestLocation() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission required',
            'Location permission is needed to show your position.',
          );
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos: any) => {
          setCurrent({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err: unknown) => {
          console.warn('Geolocation error', err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
    requestLocation();
  }, []);

  const wifiMarkers = useMemo(() => {
    if (!current || !networks.length) return [];
    const coords = generateNearbyCoords(current, networks.length);
    return coords.map((c, i) => ({
      ssid: networks[i]?.SSID ?? `Wi-Fi ${i + 1}`,
      coord: c,
      key: `${i}`,
    }));
  }, [current, networks]);

  const region = current
    ? {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  const noWifi = !networks.length;

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {current && (
          <Marker
            coordinate={current}
            title="You"
            description="Current location"
          />
        )}
        {wifiMarkers.map(m => (
          <Marker key={m.key} coordinate={m.coord} title={m.ssid} />
        ))}
      </MapView>

      {noWifi && (
        <View style={styles.overlay}>
          <Text style={styles.message}>
            🔌 No available Wi-Fi networks or device does not support scanning.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    borderRadius: 12,
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});

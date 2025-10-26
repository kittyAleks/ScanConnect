import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useWifiStore } from '../../store/wifiStore';
import { useEventsStore } from '../../store/eventsStore';

type LatLng = { latitude: number; longitude: number };

function generateNearbyCoords(center: LatLng, count: number): LatLng[] {
  const res: LatLng[] = [];
  for (let i = 0; i < count; i++) {
    const dx = (Math.random() - 0.5) * 0.001;
    const dy = (Math.random() - 0.5) * 0.001;
    res.push({
      latitude: center.latitude + dy,
      longitude: center.longitude + dx,
    });
  }
  return res;
}

export const Map = () => {
  const networks = useWifiStore(state => state.networks);
  const { logEvent } = useEventsStore();
  const [current, setCurrent] = useState<LatLng | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    logEvent('Display map');
  }, [logEvent]);

  useEffect(() => {
    if (hasRequestedLocation) return;

    async function requestLocation() {
      setHasRequestedLocation(true);

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'ScanConnect needs access to your location to show your position on the map.',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsLoadingLocation(false);
          setLocationError(true);
          return;
        }
      }

      // Сначала попробуем быструю геолокацию (Wi-Fi/сеть)
      Geolocation.getCurrentPosition(
        (pos: any) => {
          console.log('🔥 Geolocation_current:', pos);
          setCurrent({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setIsLoadingLocation(false);
          setLocationError(false);
        },
        (err: any) => {
          console.warn('❌ Fast location failed, trying with GPS:', err.code);
          // Fallback: пытаемся с GPS (медленнее, но точнее)
          Geolocation.getCurrentPosition(
            (pos: any) => {
              console.log('✅ GPS location success:', pos);
              setCurrent({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
              setIsLoadingLocation(false);
              setLocationError(false);
            },
            (err2: any) => {
              console.error('❌ GPS location failed:', err2);
              setIsLoadingLocation(false);
              setLocationError(true);
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 0,
            },
          );
        },
        {
          enableHighAccuracy: false, // Быстрая геолокация через Wi-Fi/сеть
          timeout: 10000, // 10 секунд для быстрой локации
          maximumAge: 60000, // Разрешаем использовать кеш до 1 минуты
        },
      );
    }

    requestLocation();
  }, [hasRequestedLocation]);

  const wifiMarkers = useMemo(() => {
    if (!current || !networks.length || isLoadingLocation) return [];
    const coords = generateNearbyCoords(current, networks.length);
    return coords.map((c, i) => ({
      ssid: networks[i]?.SSID ?? `Wi-Fi ${i + 1}`,
      coord: c,
      key: `wifi-${i}-${networks[i]?.SSID || 'unknown'}`,
    }));
  }, [current, networks, isLoadingLocation]);

  const noWifi = !networks.length;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onMapReady={() => setIsMapReady(true)}
        region={
          current
            ? {
                latitude: current.latitude,
                longitude: current.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 50.4501, // дефолт Киев
                longitude: 30.5234,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      >
        {current && (
          <Marker
            coordinate={current}
            title="You"
            description="Your current location"
            pinColor="blue"
          />
        )}
        {wifiMarkers &&
          wifiMarkers.length > 0 &&
          current &&
          isMapReady &&
          wifiMarkers.map(m => (
            <Marker
              key={m.key}
              coordinate={m.coord}
              title={m.ssid}
              pinColor="red"
            />
          ))}
      </MapView>

      {isLoadingLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Getting location...</Text>
        </View>
      )}

      {locationError && !isLoadingLocation && !current && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>⚠️ Location unavailable</Text>
          <Text style={styles.errorSubtext}>
            Unable to determine your location.{'\n'}• GPS is enabled in settings
            {'\n'}• Location permission granted{'\n'}• High accuracy mode
            enabled
          </Text>
        </View>
      )}

      {noWifi && !isLoadingLocation && (
        <View style={styles.overlay}>
          <Text style={styles.message}>
            🔌 No available Wi-Fi networks detected.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
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
  errorOverlay: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: '700',
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
});

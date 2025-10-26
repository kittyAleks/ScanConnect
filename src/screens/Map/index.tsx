import React, { useEffect, useMemo, useState } from 'react';
import { View, Platform, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useWifiStore } from '../../store/wifiStore';
import { useEventsStore } from '../../store/eventsStore';
import { mapStyles } from './styles';
import { useLocation } from '../../hooks/useLocation';
import type { LatLng } from '../../hooks/useLocation';

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
  const {
    location: current,
    isLoading: isLoadingLocation,
    error: locationError,
  } = useLocation();
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    logEvent('Display map');
  }, [logEvent]);

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
    <View style={mapStyles.container}>
      <MapView
        style={mapStyles.map}
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
                latitude: 50.4501,
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
        <View style={mapStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={mapStyles.loadingText}>Getting location...</Text>
        </View>
      )}

      {locationError && !isLoadingLocation && !current && (
        <View style={mapStyles.errorOverlay}>
          <Text style={mapStyles.errorText}>⚠️ Location unavailable</Text>
          <Text style={mapStyles.errorSubtext}>
            Unable to determine your location.{'\n'}• GPS is enabled in settings
            {'\n'}• Location permission granted{'\n'}• High accuracy mode
            enabled
          </Text>
        </View>
      )}

      {noWifi && !isLoadingLocation && (
        <View style={mapStyles.overlay}>
          <Text style={mapStyles.message}>
            🔌 No available Wi-Fi networks detected.
          </Text>
        </View>
      )}
    </View>
  );
};

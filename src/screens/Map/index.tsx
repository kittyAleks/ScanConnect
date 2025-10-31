import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Platform, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useWifiStore } from '../../store/wifiStore';
import { useEventsStore } from '../../store/eventsStore';
import { mapStyles } from './styles';
import { buildWifiMarkers } from '../../utils/wifiMarkers';
import { useFocusEffect } from '@react-navigation/native';
import { requestLocationPermission } from '../../hooks/usePermissions';

export const Map = () => {
  const networks = useWifiStore(state => state.networks);
  const { logEvent } = useEventsStore();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [wifiMarkers, setWifiMarkers] = useState<any[]>([]);
  const isFocusedRef = useRef(false);
  const networksRef = useRef(networks);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    networksRef.current = networks;
  }, [networks]);

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      logEvent('Display map');
      requestLocationPermission();

      const timeoutId = setTimeout(() => {
        if (isFocusedRef.current) {
          const markers = buildWifiMarkers(networksRef.current as any);
          setWifiMarkers(markers);
        }
      }, 100);

      return () => {
        isFocusedRef.current = false;
        clearTimeout(timeoutId);
      };
    }, [logEvent]),
  );

  const noWifi = !networks.length;

  return (
    <View style={mapStyles.container}>
      <MapView
        ref={mapRef}
        style={mapStyles.map}
        onMapReady={() => setIsMapReady(true)}
        {...(currentLocation && {
          region: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
        })}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        onUserLocationChange={e => {
          const location = e.nativeEvent.coordinate;

          if (location && location.latitude && location.longitude) {
            setCurrentLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            });
            setIsLoadingLocation(false);
            setLocationError(false);

            if (!currentLocation) {
              mapRef.current?.animateToRegion(
                {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );
            }
          }
        }}
      >
        {wifiMarkers &&
          wifiMarkers.length > 0 &&
          isMapReady &&
          wifiMarkers.map((m, index) => (
            <Marker
              key={`${m.key}-${index}`}
              coordinate={m.coord}
              title={m.ssid}
              pinColor="red"
            />
          ))}
      </MapView>

      {isLoadingLocation && !currentLocation && (
        <View style={mapStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={mapStyles.loadingText}>Getting location...</Text>
        </View>
      )}

      {locationError && !isLoadingLocation && !currentLocation && (
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

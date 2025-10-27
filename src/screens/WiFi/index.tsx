import React from 'react';
import { Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useWifiStore } from '../../store/wifiStore';
import { useEventsStore } from '../../store/eventsStore';
import { WiFiItem } from '../../components/WIFI/WiFiItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { sendPushNotification } from '../../utils/notifications';

export const WiFi = () => {
  const { networks, loading, scanNetworks } = useWifiStore();
  const { logEvent } = useEventsStore();

  const handleConnect = (ssid: string) => {
    logEvent('Connect to Wi-Fi', {
      name: 'Connect to Wi-Fi',
      date: new Date().toISOString(),
      details: { ssid },
    });
    sendPushNotification(
      'Wi-Fi Connected',
      `Successfully connected to ${ssid}`,
    );
  };

  return (
    <SafeAreaView>
      <Button title="Scan networks" onPress={scanNetworks} />
      {loading && <ActivityIndicator style={styles.loadingIndicator} />}
      {!loading && (
        <FlatList
          style={styles.networkList}
          data={networks}
          keyExtractor={(item, index) => item.BSSID ?? index.toString()}
          renderItem={({ item }) => (
            <WiFiItem
              ssid={item.SSID}
              level={item.level}
              onConnect={() => handleConnect(item.SSID)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

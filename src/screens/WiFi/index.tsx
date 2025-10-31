import React from 'react';
import { Button, FlatList, ActivityIndicator, View, Text } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <Button title="Scan networks" onPress={scanNetworks} disabled={loading} />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}
      <FlatList
        style={styles.networkList}
        data={networks}
        keyExtractor={(item, index) =>
          item?.BSSID || item?.SSID || `wifi-${index}`
        }
        renderItem={({ item }) =>
          item?.SSID ? (
            <WiFiItem
              ssid={item.SSID}
              level={item.level}
              onConnect={() => handleConnect(item.SSID)}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && networks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No networks found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

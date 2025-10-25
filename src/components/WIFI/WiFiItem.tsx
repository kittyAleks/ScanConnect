import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from './styles';

type Props = {
  ssid: string;
  level?: number;
  onConnect: () => void;
};

export const WiFiItem = ({ ssid, level, onConnect }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.ssid}>{ssid || '<Without name>'}</Text>
        <Text style={styles.level}>RSSI: {level ?? '—'}</Text>
      </View>
      <Button title="Connect" onPress={onConnect} />
    </View>
  );
};

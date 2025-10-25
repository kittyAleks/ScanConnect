import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useEventsStore } from '../../store/eventsStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

function formatDate(ts: number): string {
  const date = new Date(ts);
  const pad = (n: number) => `${n}`.padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${dd}.${MM}.${yyyy} ${hh}:${mm}:${ss}`;
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function EmptyList() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No events yet</Text>
    </View>
  );
}

export const Events = () => {
  const { events, clearEvents } = useEventsStore();

  const data = useMemo(() => events, [events]);

  const copyEvent = (id: string) => {
    const e = data.find(x => x.id === id);
    if (!e) return;
    const text = `Event: ${e.name}\nDate: ${formatDate(
      e.timestamp,
    )}\nData: ${JSON.stringify(e.data ?? {}, null, 2)}`;
    Clipboard.setString(text);
    Alert.alert('Copied', 'Event copied to clipboard');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
        {item.data ? (
          <Text style={styles.itemData} numberOfLines={2}>
            {JSON.stringify(item.data)}
          </Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => copyEvent(item.id)}>
          <Text style={styles.actionText}>Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity onPress={clearEvents}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={data.length === 0 ? styles.empty : undefined}
      />
    </SafeAreaView>
  );
};

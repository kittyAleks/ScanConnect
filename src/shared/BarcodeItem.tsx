import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ScannedBarcode } from '../store/barcodeStore';

export const BarcodeItem = ({
  item,
  onToggleMark,
  onDrag,
  isActive,
}: {
  item: ScannedBarcode;
  onToggleMark: () => void;
  onDrag: () => void;
  isActive: boolean;
}) => (
  <TouchableOpacity
    onLongPress={onDrag}
    disabled={isActive}
    style={[
      styles.itemContainer,
      { backgroundColor: isActive ? '#e0e0e0' : '#fff' },
    ]}
  >
    <Text style={styles.valueText}>{item.value}</Text>
    <TouchableOpacity onPress={onToggleMark}>
      <Text style={[styles.actionText, { color: 'green' }]}>
        {item.marked ? 'Unmark' : 'Mark'}
      </Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  valueText: { flex: 1, fontSize: 16 },
  actionText: { paddingHorizontal: 10, fontSize: 16 },
});

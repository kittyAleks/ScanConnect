import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ScannedBarcode } from '../store/barcodeStore';

export const BarcodeItem = ({
  item,
  onDrag,
  isActive,
}: {
  item: ScannedBarcode;
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
    <Text style={[styles.valueText, item.marked && styles.markedText]}>
      {item.value}
    </Text>
    <Text style={styles.marker}>{item.marked ? '✓' : ''}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  valueText: {
    flex: 1,
    fontSize: 16,
  },
  markedText: {
    fontWeight: '600',
    color: '#28a745',
  },
  marker: {
    fontSize: 20,
    color: '#28a745',
    marginLeft: 8,
  },
});

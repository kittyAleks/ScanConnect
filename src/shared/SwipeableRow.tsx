import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export const SwipeableRow = ({ children, onDelete, onMark }: any) => {
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <View style={styles.actionsRow}>
        <View style={styles.actionWrapper}>
          <TouchableOpacity
            style={[styles.fab, styles.fabMark]}
            onPress={onMark}
          >
            <Text style={styles.fabIcon}>✓</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionWrapper}>
          <TouchableOpacity
            style={[styles.fab, styles.fabDelete]}
            onPress={onDelete}
          >
            <Text style={styles.fabIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 18,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: 6,
    opacity: 0.9,
  },
  fabMark: {
    backgroundColor: '#6C63FF',
  },
  fabDelete: {
    backgroundColor: '#ff3b30',
  },
});

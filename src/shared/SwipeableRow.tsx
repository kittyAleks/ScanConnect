import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export const SwipeableRow = ({ children, onDelete }: any) => {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteSwipe} onPress={onDelete}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteSwipe: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  deleteText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

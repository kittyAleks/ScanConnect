import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { height: 260, width: '100%' },
  fakeCamera: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeText: { color: '#555', marginBottom: 12 },
  fakeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fakeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  listContent: { paddingVertical: 8 },
  itemContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  valueText: { flex: 1, fontSize: 16 },
  actionText: { paddingHorizontal: 10, fontSize: 16 },
  deleteSwipe: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  deleteSwipeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

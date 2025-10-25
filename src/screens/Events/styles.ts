import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  itemData: {
    fontSize: 12,
    color: '#333',
    marginTop: 6,
  },
  actions: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  actionText: {
    color: '#2f6feb',
    fontWeight: '600',
  },
  clearText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
  },
});

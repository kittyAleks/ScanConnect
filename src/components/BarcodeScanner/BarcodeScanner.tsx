import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useBarcodeStore, ScannedBarcode } from '../../store/barcodeStore';
import { useEventsStore } from '../../store/eventsStore';
import { CameraView } from './CameraView';
import { styles } from './styles';
import { SwipeableRow } from '../../shared/SwipeableRow';
import { BarcodeItem } from '../../shared/BarcodeItem';

export const BarcodeScanner = () => {
  const cameraRef = useRef(null);
  const { barcodes, addBarcode, toggleMarked, removeBarcode, reorderBarcodes } =
    useBarcodeStore();
  const { logEvent } = useEventsStore();

  const onCodeScanned = useCallback(
    (value: string) => {
      if (barcodes.some(b => b.value === value)) return;
      addBarcode({ value });
      logEvent('Barcode scanned', { value });
    },
    [barcodes, addBarcode, logEvent],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const item = barcodes.find(b => b.id === id);
      removeBarcode(id);
      logEvent('Delete barcode', { id, value: item?.value });
    },
    [removeBarcode, logEvent, barcodes],
  );

  const handleToggleMark = useCallback(
    (id: string) => {
      toggleMarked(id);
      const item = barcodes.find(b => b.id === id);
      logEvent('Toggle mark', { id, value: item?.value });
    },
    [toggleMarked, logEvent, barcodes],
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: ScannedBarcode[] }) => {
      reorderBarcodes(data);
    },
    [reorderBarcodes],
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ScannedBarcode>) => (
      <SwipeableRow
        onDelete={() => handleDelete(item.id)}
        onMark={() => handleToggleMark(item.id)}
      >
        <BarcodeItem item={item} onDrag={drag} isActive={isActive} />
      </SwipeableRow>
    ),
    [handleDelete, handleToggleMark],
  );

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} onCodeScanned={onCodeScanned} />
      <DraggableFlatList
        data={barcodes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

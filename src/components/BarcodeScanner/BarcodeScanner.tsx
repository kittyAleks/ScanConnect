import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Toast from 'react-native-toast-message';
import { useBarcodeStore, ScannedBarcode } from '../../store/barcodeStore';
import { useEventsStore } from '../../store/eventsStore';
import { CameraView } from './CameraView';
import { styles } from './styles';
import { SwipeableRow } from '../../shared/SwipeableRow';
import { BarcodeItem } from '../../shared/BarcodeItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BarcodeScanner = () => {
  const cameraRef = useRef(null);
  const { barcodes, addBarcode, toggleMarked, removeBarcode, reorderBarcodes } =
    useBarcodeStore();
  const { logEvent } = useEventsStore();
  const insets = useSafeAreaInsets();

  const [restartToken, setRestartToken] = useState(0);
  const prevCountRef = useRef<number>(barcodes.length);

  useEffect(() => {
    const prev = prevCountRef.current;
    if (prev > 0 && barcodes.length === 0) {
      setRestartToken(t => t + 1);
    }
    prevCountRef.current = barcodes.length;
  }, [barcodes.length]);

  const onCodeScanned = useCallback(
    (value: string) => {
      const exists = barcodes.some(b => b.value === value);
      if (exists) {
        Toast.show({
          type: 'info',
          text1: 'Barcode already scanned',
          text2: 'This barcode has already been added to your list',
          position: 'top',
        });
        return;
      }

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

  const bottomInset = insets.bottom + (Platform.OS === 'ios' ? 85 : 120) + 8;

  return (
    <View style={styles.container}>
      <CameraView
        key={`camera-${restartToken}`}
        ref={cameraRef}
        onCodeScanned={onCodeScanned}
      />
      <DraggableFlatList
        data={barcodes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomInset },
        ]}
        showsVerticalScrollIndicator
        ListFooterComponent={<View style={{ height: bottomInset }} />}
      />
    </View>
  );
};

import { create } from 'zustand';

export type ScannedBarcode = {
  id: string;
  value: string;
  marked: boolean;
  scannedAt: number;
};

type BarcodeStoreState = {
  barcodes: ScannedBarcode[];
  addBarcode: (
    barcode: Omit<ScannedBarcode, 'id' | 'marked' | 'scannedAt'>,
  ) => void;
  toggleMarked: (id: string) => void;
  removeBarcode: (id: string) => void;
};

function generateId(value: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${value}-${randomPart}`;
}

export const useBarcodeStore = create<BarcodeStoreState>(set => ({
  barcodes: [],
  addBarcode: ({ value }) =>
    set(state => {
      const exists = state.barcodes.some(b => b.value === value);
      if (exists) {
        return state;
      }
      const next: ScannedBarcode = {
        id: generateId(value),
        value,
        marked: false,
        scannedAt: Date.now(),
      };
      return { barcodes: [next, ...state.barcodes] };
    }),
  toggleMarked: id =>
    set(state => ({
      barcodes: state.barcodes.map(b =>
        b.id === id ? { ...b, marked: !b.marked } : b,
      ),
    })),
  removeBarcode: id =>
    set(state => ({
      barcodes: state.barcodes.filter(b => b.id !== id),
    })),
}));

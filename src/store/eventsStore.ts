import { create } from 'zustand';

export type AppEvent = {
  id: string;
  name: string;
  timestamp: number;
  data?: Record<string, unknown>;
};

type EventsStoreState = {
  events: AppEvent[];
  logEvent: (name: string, data?: Record<string, unknown>) => void;
  clearEvents: () => void;
};

function generateId(name: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${name}-${randomPart}-${Date.now()}`;
}

export const useEventsStore = create<EventsStoreState>(set => ({
  events: [],
  logEvent: (name, data) =>
    set(state => ({
      events: [
        { id: generateId(name), name, timestamp: Date.now(), data },
        ...state.events,
      ],
    })),
  clearEvents: () => set({ events: [] }),
}));

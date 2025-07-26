import { create } from "zustand";

type HistoryEntry = {
  fileName: string;
  summary: string;
  date: string;
};

type HistoryStore = {
  history: HistoryEntry[];
  usageCount: number;
  addToHistory: (entry: HistoryEntry) => void;
  resetHistory: () => void;
  incrementCount: () => void;
};

export const useHistoryStore = create<HistoryStore>((set: (fn: (state: HistoryStore) => HistoryStore | Partial<HistoryStore>) => void) => ({
  history: [],
  usageCount: 0,
  addToHistory: (entry: HistoryEntry) =>
    set((state) => ({
      history: [...state.history, entry],
      usageCount: state.usageCount + 1,
    })),
  resetHistory: () => set(() => ({ history: [], usageCount: 0 })),
  incrementCount: () => set((state) => ({ usageCount: state.usageCount + 1 })),
}));
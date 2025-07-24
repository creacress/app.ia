import { useEffect, useState } from "react";

type SummaryItem = {
  fileName: string;
  summary: string;
  date: string;
};

export function useHistoryStore() {
  const [history, setHistory] = useState<SummaryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pdfSummaryHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const addToHistory = (item: SummaryItem) => {
    const updated = [item, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("pdfSummaryHistory", JSON.stringify(updated));
  };

  return { history, addToHistory };
}
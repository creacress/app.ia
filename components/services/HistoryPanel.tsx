

import React from 'react';

type HistoryPanelProps = {
  history: string[];
  onSelect: (value: string) => void;
  className?: string;
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, className }) => {
  if (history.length === 0) return null;

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 max-h-[80vh] w-64 overflow-y-auto border border-zinc-700 bg-zinc-900/80 backdrop-blur-md rounded-lg p-4 shadow-lg space-y-2 animate-fade-in ${className || ''}`}
    >
      <h3 className="text-indigo-400 text-lg font-semibold mb-2">Historique</h3>
      {history.map((entry, index) => (
        <button
          key={index}
          onClick={() => onSelect(entry)}
          className="text-left text-sm text-zinc-300 hover:text-indigo-300 hover:underline w-full"
        >
          {entry.length > 80 ? entry.slice(0, 80) + '…' : entry}
        </button>
      ))}
    </div>
  );
};

export default HistoryPanel;
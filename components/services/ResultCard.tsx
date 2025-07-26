

import React from 'react';

type ResultCardProps = {
  content: string;
  onCopy?: () => void;
  copied?: boolean;
  className?: string;
};

const ResultCard: React.FC<ResultCardProps> = ({ content, onCopy, copied, className }) => {
  return (
    <div className={`bg-zinc-800/80 border border-zinc-700 p-4 rounded-lg shadow-md space-y-4 animate-fade-in ${className || ''}`}>
      <p className="whitespace-pre-wrap text-zinc-300">{content}</p>
      {onCopy && (
        <button
          onClick={onCopy}
          className="text-sm text-indigo-400 hover:underline hover:text-indigo-300 transition"
        >
          {copied ? '✅ Copié !' : '📋 Copier le contenu'}
        </button>
      )}
    </div>
  );
};

export default ResultCard;
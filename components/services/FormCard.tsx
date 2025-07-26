

import React from 'react';

type FormCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
};

const FormCard: React.FC<FormCardProps> = ({ title, description, children, onSubmit, className }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`bg-zinc-800/80 border border-zinc-700 backdrop-blur-md shadow-2xl p-6 md:p-10 rounded-lg w-full max-w-3xl mx-auto animate-fade-in ${className || ''}`}
    >
      <h2 className="text-2xl font-semibold text-indigo-400 mb-2 text-center">{title}</h2>
      {description && <p className="text-sm text-gray-400 mb-6 text-center">{description}</p>}
      <div className="space-y-4">{children}</div>
    </form>
  );
};

export default FormCard;
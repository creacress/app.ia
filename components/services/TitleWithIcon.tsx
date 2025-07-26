

import React from 'react';

type TitleWithIconProps = {
  icon: React.ReactNode;
  title: string;
  className?: string;
};

const TitleWithIcon: React.FC<TitleWithIconProps> = ({ icon, title, className }) => {
  return (
    <h1
      className={`text-4xl font-bold mb-4 text-center animate-fade-in flex items-center justify-center gap-3 ${className || ''}`}
    >
      <span className="w-8 h-8 text-indigo-400 animate-pulse-slow">{icon}</span>
      {title}
    </h1>
  );
};

export default TitleWithIcon;


import React from 'react';

type FadeInWrapperProps = {
  children: React.ReactNode;
  delay?: number; // en millisecondes
  className?: string;
};

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children, delay = 0, className }) => {
  const style = {
    animationDelay: `${delay}ms`,
  };

  return (
    <div className={`animate-fade-in ${className || ''}`} style={style}>
      {children}
    </div>
  );
};

export default FadeInWrapper;
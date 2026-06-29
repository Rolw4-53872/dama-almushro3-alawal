import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = true,
  border = false,
}) => {
  const shadowClass = shadow ? 'shadow-md' : '';
  const borderClass = border ? 'border border-neutral-200' : '';

  return (
    <div className={`bg-white rounded-lg p-6 ${shadowClass} ${borderClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

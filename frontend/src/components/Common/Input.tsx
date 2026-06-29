import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helpText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all-smooth focus-ring bg-white ${
            error ? 'border-danger-500' : 'border-neutral-200 focus:border-primary-500'
          } ${icon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
        {icon && <span className="absolute right-3 top-3 text-neutral-400">{icon}</span>}
      </div>
      {error && <span className="text-danger-600 text-sm">{error}</span>}
      {helpText && <span className="text-neutral-500 text-sm">{helpText}</span>}
    </div>
  );
};

export default Input;

import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  helpText,
  className,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random()}`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all-smooth focus-ring bg-white ${
          error ? 'border-danger-500' : 'border-neutral-200 focus:border-primary-500'
        } ${className || ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-danger-600 text-sm">{error}</span>}
      {helpText && <span className="text-neutral-500 text-sm">{helpText}</span>}
    </div>
  );
};

export default Select;

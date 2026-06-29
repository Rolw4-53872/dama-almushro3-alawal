import React from 'react';

interface SuccessMessageProps {
  message?: string | null;
  onClose?: () => void;
  title?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
  title = 'نجح',
}) => {
  if (!message) return null;

  return (
    <div className="bg-success-50 border-l-4 border-success-600 p-4 rounded">
      <div className="flex items-start gap-3">
        <div className="text-success-600 text-xl">✓</div>
        <div className="flex-1">
          <p className="font-semibold text-success-800">{title}</p>
          <p className="text-success-700 text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-success-600 hover:text-success-700 font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
